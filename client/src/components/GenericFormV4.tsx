
import { Drawer, Form, Button, Divider, Typography, Checkbox } from 'antd';
import { GenericFormFieldV3 } from '../types/forms/GenericFormTypes';
import { flattenFields } from '../services/helper';
import _ from 'lodash';

/**
 * GenericFormDrawer component.
 * Renders a Drawer with a form that dynamically creates input fields based on the given array of field configurations.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.visible - Whether the drawer is visible.
 * @param {Field[]} props.fields - The array containing field configurations.
 * @param {Function} props.onClose - The function to call when closing the drawer.
 * @param {Function} props.onSubmit - The function to call when submitting the form.
 */
const GenericFormDrawer: React.FC<{
  visible: boolean;
  fields: GenericFormFieldV3[];
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => void;
  config: any
}> = ({ visible, fields, onClose, onSubmit, config }) => {
  const [form] = Form.useForm();

  // Handle form submission
  const handleFinish = async (values: Record<string, any>) => {
    const data = form.getFieldsValue();
    // console.log(config)
    const flatFields = flattenFields(config.fields);
    flatFields.filter(field => !field.editable && field.computed_value).forEach(field => {
      console.log(field.identifier)
      if(field.computed_value_type === "sum"){
        data[field.identifier] = _.sum(field.computed_values.map((v : any) => parseInt(data[v])));
      }
    });
    // console.log(data)
    await onSubmit(data);
    form.resetFields();
  };

  return (
    <Drawer
      title="Insert Data"
      width={400}
      onClose={onClose}
      open={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {fields.filter(field => field).map(({ name, label, input, type, required = true, initialValue }) => {
          // Default the 'required' property to true if not set
          const rules = required
            ? [{ required: true, message: `Please input your ${label}!` }]
            : [];

          if (type === 'input') {
            return (
              <Form.Item key={name} label={label} name={name} rules={rules} initialValue={initialValue || ''}>
                {input}
              </Form.Item>
            );
          }
          if (type === 'checkbox') {
            return (
              <Form.Item
                key={name}
                label={label}
                name={name}
                valuePropName="checked"
                rules={rules}
              >
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
    </Drawer>
  );
};

export default GenericFormDrawer;

