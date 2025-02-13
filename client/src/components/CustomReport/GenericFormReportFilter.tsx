import { Drawer, Form, Button, Divider, Typography, Checkbox, Row, Col, Input, Tooltip, Flex, Collapse, Select, Card } from 'antd';
import { GenericFormFieldV3 } from '../../types/forms/GenericFormTypes';
import TextArea from 'antd/es/input/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FormFieldsBySector } from '../../types/forms/formFields';
import Title from 'antd/es/typography/Title';
import { FormEnum, reportTitles } from '../../types/forms/formNameEnum';
import { add, div } from '@tensorflow/tfjs';
import { useForm } from 'antd/es/form/Form';
import _ from 'lodash';

/**
 * CustomReportGenerator component.
 * Renders a Drawer with two sections:
 * 1. Filter Form: Allows users to input filter criteria. All fields are optional, and only filled fields will be submitted.
 * 2. Field Selection Form: Displays checkboxes for each field to determine if the field should be included in the result.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.visible - Whether the drawer is visible.
 * @param {Field[]} props.fields - The array containing field configurations.
 * @param {Function} props.onClose - The function to call when closing the drawer.
 * @param {Function} props.onSubmit - The async function to call when submitting the form.
 */
const CustomReportGenerator: React.FC<{
  visible: boolean;
  fields: GenericFormFieldV3[];
  onClose: () => void;
  onSubmit: (reportTitle: string, description : string, filters: Record<string, any>, fieldSelections: { name: string; included: boolean }[]) => Promise<void>;
  isCustom : boolean
  title : string,
  formName : FormEnum
}> = ({ visible, fields, onClose, onSubmit, isCustom, title, formName  }) => {
  
  const [form] = Form.useForm();
  const [selectionForm] = Form.useForm();
  const [additionalFieldForm] = Form.useForm();
  const [drawer2, setDrawer2] = useState(false);
  const [selectedTables, setSelectedTables] = useState<any>([]);

  // Custom validation function for field selections
  const validateSelection = (_, value, fields) => {
    const o = selectionForm.getFieldsValue(true, (meta) => {
      return fields.includes(meta.name[0]);
    });

    const atLeastOneChecked = Object.values(o).some((val) => !!val);
    if (!atLeastOneChecked) {
      return Promise.reject(new Error('At least one field must be selected.'));
    }
    return Promise.resolve();
  };

  // Handle form submission
  const handleFinish = async () => {
    try {
      if(isCustom)
        await selectionForm.validateFields(); // Validate the selection form before proceeding
      await form.validateFields(); // Ensure this is called for the report title validation

      const filterValues = form.getFieldsValue();
      const selectionValues = selectionForm.getFieldsValue();

      if(isCustom) {  
        const additionalFields = {};
        const additionalFieldValue = additionalFieldForm.getFieldsValue();
        Object.entries(additionalFieldValue).filter(([key, value]) => value !== "on").forEach(([key, value]) => {
          _.set(additionalFields, key, !!value);
        });
        console.log(additionalFields)
      }
      
      // Extract report title and description separately
      const reportTitle = isCustom && filterValues.reportTitle;
      const description = filterValues.reportDescription;
      

      // Filter out the fields that are empty in the filter form
      const filledFilterValues = Object.fromEntries(
        Object.entries(filterValues).filter(([key, value]) => key !== 'reportTitle' && key != 'reportDescription' && value !== undefined && value !== null && value !== '')
      );

      // Create the array of field selections based on the checkbox values
      const fieldSelections = isCustom
        ? fields.map(({ name }) => ({
            name,
            included: selectionValues[name] || false,
          }))
        : fields
            .filter(({ type }) => type !== 'title' && type !== 'divider')
            .map(({ name, notDefault }) => ({
              name,
              included: notDefault ? false : true,
            }));

      // Submit report title, description, filter values, and field selections
      await onSubmit(reportTitle, description, filledFilterValues, fieldSelections); 
      form.resetFields();
      selectionForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const onCloseAdditionalFields = async () => {
    console.log(additionalFieldForm.getFieldsValue())
    await additionalFieldForm.validateFields()
    setDrawer2(false);
  }

  const renderOtherFields = () => {

    const [selectTableForm] = Form.useForm();

    const handleTableSelection = (values: { table: string }) => {
      if(selectedTables.includes(values.table)){
        selectTableForm.resetFields();
        return
      } 
      setSelectedTables([...selectedTables, values.table]);
      selectTableForm.resetFields();
    };

    const handleRemoveTable = (table) => {
      setSelectedTables(selectedTables.filter((t) => t !== table));
    }

    return (
      <div>
        <Card className='mb-4'>
          <Form form={selectTableForm} onFinish={handleTableSelection}>
            <Title level={5}>Select Table</Title>
            <Flex gap={4}>
              <Form.Item name="table" className='w-full' rules={[{ required: true, message: 'Please select a table' }]}>
                <Select
                  showSearch
                  className='w-full'
                  optionFilterProp="label"
                  placeholder="Select a table"
                  options={
                  Object.entries(FormFieldsBySector).map(([sectorKey, value]) => {
                    return {  
                      label: sectorKey.charAt(0).toUpperCase() + sectorKey.slice(1),
                      title : sectorKey,
                      options : Object.entries(value).filter(([formKey, value]) => formKey !== formName).map(([formKey, value]) => {
                        return {
                          label : reportTitles[formKey],
                          value : `${sectorKey}.${formKey}`
                        }
                      })
                    };
                  })
                  } />
              </Form.Item>
              <Form.Item>
                <Button htmlType='submit' color='primary' variant='filled'>Add</Button>
              </Form.Item>
            </Flex>
          </Form>
        </Card>
        <Form form={additionalFieldForm}>
          {
            selectedTables.map((table : any) => {
              const [sector, form] = table.split('.');
              return (
                <div key={table}>
                  <Title level={5}>
                    <Button onClick={() => handleRemoveTable(table)} size='small' className='me-3' color='danger' variant='outlined'  >Remove</Button>
                    {reportTitles[form]}
                  </Title>
                  <Form.Item
                    name={form}
                    rules={[{ validator: (_, value) => {
                      console.log(FormFieldsBySector[sector][form].filter(e => e.type != 'title' && e.type != 'divider').map(({ name, label }) => name))
                      const o = additionalFieldForm.getFieldsValue(true, (meta) => {
                        return FormFieldsBySector[sector][form].filter(e => e.type != 'title' && e.type != 'divider').map(({ name, label }) => `${form}.${name}`).includes(meta.name[0]);
                      });

                      const atLeastOneChecked = Object.values(o).some((val) => !!val);
                      if (!atLeastOneChecked) {
                        return Promise.reject(new Error('At least one field must be selected.'));
                      }
                      return Promise.resolve();
                    } }]} // Custom validation rule
                  >
                    <Row>
                      {FormFieldsBySector[sector][form].filter(e => e.type != 'title' && e.type != 'divider').map(({ name, label }) => (
                        <Col span={24} key={name}>
                          <Form.Item name={`${form}.${name}`} valuePropName="checked" noStyle>
                            <Checkbox>{label}</Checkbox>
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                  </Form.Item>
                </div>
              );
            })
          }
        </Form>
      </div>
    )
  };


  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleFinish} type="primary">
            Apply
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {isCustom && (
          <Form.Item
            key="reportTitle"
            label="Report Title"
            name="reportTitle"
            rules={[{ required: true, message: 'Report title is required.' }]} // Make report title required
          >
            <Input placeholder="Enter report title" />
          </Form.Item>
        )}

        {isCustom && (
          <Form.Item
            key="reportDescription"
            label="Description"
            name="reportDescription"
          >
            <TextArea placeholder="Enter report description" />
          </Form.Item>
        )}


        <Typography.Title level={4}>Filter Data</Typography.Title>

        {fields.map(({ name, label, input, type }) => {
          const rules = []; // No required validation as all fields are optional

          if (type === 'input') {
            return (
              <Form.Item key={name} label={label} name={name} rules={!isCustom && name=='calendar_year' ? [{ required: true, message: 'Calendar year is required.' }] : rules}>
                {input}
              </Form.Item>
            );
          }
          if (type === 'checkbox') {
            return (
              <Form.Item key={name} label={label} name={name} valuePropName="checked" rules={rules}>
                <Checkbox>{input}</Checkbox>
              </Form.Item>
            );
          }
          if (type === 'title') {
            return (
              <Typography.Title level={5} key={name}>
                {label}
              </Typography.Title>
            );
          }
          if (type === 'divider') {
            return <Divider key={name} />;
          }
          return null; // Fallback case
        })}
      </Form>
      <Divider />

      {isCustom && (
        <Form form={selectionForm} layout="vertical">
          <Typography.Title level={4}>
            Select Fields to Display 
            {/* <Tooltip title="Add more fields from other tables">
              <Button className='ms-3' size='small' variant='outlined' color='primary' onClick={() => setDrawer2(true)} icon={<FontAwesomeIcon icon={faPlus} />}></Button>
            </Tooltip> */}
          </Typography.Title>
          <Form.Item
            name="selection"
            required
            rules={[{ validator: (_, value) => validateSelection(_, value, fields.filter(e => e.type != 'title' && e.type != 'divider').map(({ name }) => name)) }]} // Custom validation rule
          >
            <Row>
              {fields.filter(e => e.type != 'title' && e.type != 'divider').map(({ name, label }) => (
                <Col span={24} key={name}>
                  <Form.Item name={name} valuePropName="checked" noStyle>
                    <Checkbox>{label}</Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form.Item>
        </Form>
      )}

      {/* <Drawer 
      footer = {
        <Flex justify='end' gap={4}>
          <Button color='primary' variant='filled' onClick={() => {
            setSelectedTables([])
            additionalFieldForm.resetFields()
            setDrawer2(false)
            }}>Cancel</Button>
          <Button color='primary' variant='solid' onClick={onCloseAdditionalFields}>Done</Button>
        </Flex>
      }
      closable={false}
      size='large'
      open={drawer2}
      title="Add more fields">
        {renderOtherFields()}
      </Drawer> */}
    </Drawer>
  );
};

export default CustomReportGenerator;


