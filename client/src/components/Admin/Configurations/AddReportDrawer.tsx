
import { Button, Checkbox, Collapse, Drawer, Flex, Form, FormInstance, Input, message, Select, Space, Typography } from "antd";
import { useAddReportConfigStore } from "../../../stores/useReportConfigStore";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { reportConfigCreate } from "../../../services/api/reportConfigApi";
import { parseResError } from "../../../services/errorHandler";
import { flattenFields } from "../../../services/helper";

const uniqueValuesValidator = async (_, values) => {
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
        return Promise.reject(new Error('Values must be unique.'));
    }
    return Promise.resolve();
}

const IsNestedComponent = ({fieldName, form}) => {
    const [isNested, setIsNested] = useState(false);
    const [editable, setEditable] = useState(false);
    const [inputType, setInputType] = useState("");
    const [isComputed, setIsComputed] = useState(false);
    const [fieldIdentifier, setFieldIdentifier] = useState("");
    
    const handleIsNestedOnChange = (e) => {
        console.log(e.target.checked);
        setIsNested(e.target.checked);
    }

    const handleisComputedOnChange = (e) => {
        console.log(e.target.checked);
        setIsComputed(e.target.checked);
    }

    const handleIsEditableOnChange = (e) => {
        console.log(e.target.checked);
        setEditable(e.target.checked);
    }

    const handleInputTypeOnChange = (e) => {
        console.log(e);
        setInputType(e);
    }

    return (
        <>
            <Form.Item
                preserve={false}
                label="Identifier"
                name={[fieldName, 'identifier']}
                rules={[
                    { required: true, message: 'Please enter an identifier' },
                    {
                        pattern: /^[^$.]+$/,
                        message: 'The identifier should not contain $ or .',
                    },
                    {
                        validator : async (_, value) => {
                            const _values = [...flattenFields((await form.getFieldValue("fields")))];
                            const values=[ ..._values.map(field => field.identifier)];
                            return uniqueValuesValidator(_, values);
                        }
                    }
                ]}
            >
                <Input onChange={(e) => setFieldIdentifier(e.target.value)} placeholder="Unique field identifier" />
            </Form.Item>

            

            <Form.Item
                preserve={false}
                name={[fieldName, 'is_nested']}
                valuePropName="checked"
                initialValue={false}
            >
                <Checkbox  onChange={handleIsNestedOnChange}>Is Nested</Checkbox>
            </Form.Item>

            {
                !isNested && (
                    <>

                        <Form.Item
                        preserve={false}
                        label="Input Type"
                        name={[fieldName, 'input_type']}
                        rules={[{ required: true, message: 'Please select an input type' }]}
                        >
                            <Select onChange={(e) => handleInputTypeOnChange(e)} placeholder="Select input type">
                                <Select.Option value="text">Text</Select.Option>
                                <Select.Option value="number">Number</Select.Option>
                                <Select.Option value="date">Date</Select.Option>
                                <Select.Option value="enum">Enum</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            preserve={false}
                            name={[fieldName, 'editable']}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox  onChange={handleIsEditableOnChange}>Is Editable</Checkbox>
                        </Form.Item>

                        {
                            !editable && (
                                <>
                                    <Form.Item
                                        preserve={false}
                                        name={[fieldName, 'computed_value']}
                                        valuePropName="checked"
                                        initialValue={false}
                                    >
                                        <Checkbox value={isComputed} onChange={handleisComputedOnChange}>Is Computed Value</Checkbox>
                                    </Form.Item>
                                    {
                                        isComputed && (
                                            <Form.Item
                                                label="Computed Value"
                                                preserve={false}
                                                name={[fieldName, 'computed_values']}
                                                rules={[{ required: true, message: 'Please select other fields' }]}
                                            >
                                                <Select mode="multiple" options={
                                                    flattenFields((form.getFieldValue("fields")))
                                                    .filter(field => field.identifier && (field.identifier !== fieldIdentifier) && !field.is_nested && field.computed_value == false && field.input_type == "number")
                                                    .map(field => ({label: field.identifier, value: field.identifier}))
                                                } />
                                            </Form.Item>
                                        )
                                    }
                                    {
                                        !isComputed && (
                                            <Form.Item
                                                label="Default"
                                                preserve={false}
                                                name={[fieldName, 'default']}
                                                rules={[{ required: true, message: 'Please enter the default value' }]}
                                            >
                                                <Input placeholder="Default Value" />
                                            </Form.Item>
                                        )
                                    }
                                    
                                </>
                            )
                        }

                        {
                            inputType === "enum" 
                            && (
                            <Form.Item preserve={false} name={[fieldName, "values"]} label="Values" rules={[{ required: true, message: 'Please add at least one value for the enum.' }]}>
                                <Form.List  name={[fieldName, "values"]} >
                                    {(fields, { add: addValue, remove: removeValue }) => (
                                    <Flex gap={10}>
                                        {fields.map((field, index) => (
                                        <Flex gap={5} key={field.key} align="baseline">
                                            <Form.Item
                                                {...field}
                                                preserve={false}
                                                name={field.name}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                                >
                                                <Input placeholder="Value" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => removeValue(field.name)} />
                                        </Flex>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => addValue()} block icon={<PlusOutlined />}>
                                                Add value
                                            </Button>
                                        </Form.Item>
                                    </Flex>
                                    )}
                                </Form.List>
                            </Form.Item>
                            )
                        }       
                    </>
                )
            }

            {
                isNested && <RecursiveField fieldPath={[fieldName, 'children']} form={form} />
            }
        </>
    )
}

const RecursiveField = ({ fieldPath, form } : { fieldPath: any, form: FormInstance }) => {
    return (
        <Form.Item
            preserve={false}
            label="Fields"
            name={fieldPath}
            rules={[{ required: true, message: 'Please add at least one field.' }]}
        >
            <Form.List name={fieldPath} initialValue={[]} >
                {(fields, { add, remove }) => {
                    return (
                    <div>
                        {fields.map((field, index) => {
                            return (
                            <Collapse key={field.key} className="mb-2 hover:bg-slate-100 hover:border-slate-300" >
                                <Collapse.Panel header={`Field ${index + 1}`} key={field.key} extra={(
                                        <Button
                                            variant="dashed"
                                            color="danger"
                                            onClick={() => remove(field.name)}
                                            icon={<MinusCircleOutlined />}
                                        >
                                            Remove Field
                                        </Button>
                                    )}>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <Form.Item
                                        preserve={false}
                                        label="Field Name"
                                        name={[field.name, 'name']}
                                        rules={[{ required: true, message: 'Please enter a field name' }]}
                                    >
                                        <Input  placeholder="Field name" />
                                    </Form.Item>

                                    <IsNestedComponent fieldName={field.name} form={form} />

                                </Space>
                                </Collapse.Panel>
                            </Collapse>
                            )
                        })
                        }
            
                        {/* Add Field Button */}
                        <Form.Item preserve={false}>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                        >
                            Add Field
                        </Button>
                        </Form.Item>
                    </div>
                    )}
                }
            </Form.List>
        </Form.Item>
    );
            
};


const AddReportDrawer = () => {
    const AddReportConfigStore = useAddReportConfigStore();
    const [form] = Form.useForm();

    const handleFinish = async () => {
        console.log(flattenFields(form.getFieldValue("fields")));
        try {
            console.log(form.getFieldsValue());
            await reportConfigCreate(form.getFieldsValue());
            message.success("Report Config created successfully.");
            AddReportConfigStore.setSector(null);
            form.resetFields();
        } catch (error) {
            message.error(parseResError(error).msg);
        }
        
    }

    useEffect(() => {
        if (AddReportConfigStore.sector) {
            form.setFieldsValue({ sectorName: AddReportConfigStore.sector.name, sector: AddReportConfigStore.sector._id });
        }
    }, [AddReportConfigStore.sector]);
    
    return (
        <Drawer 
            width="100%"
            open={!!AddReportConfigStore.sector}
            onClose={() => {
                    form.resetFields();
                    AddReportConfigStore.setSector(null)
                }
            }>
            <Form 
            onValuesChange={(values) => {
                // console.log(values)
            }}
                form={form}
                onFinish={handleFinish}
                onFieldsChange={() => {
                    const updatedValues = form.getFieldsValue();
                    // Apply similar cleanup logic as in Solution 2, if needed
                    form.setFieldsValue(updatedValues);
                }}>
                <Flex gap={10} justify="">
                    <Form.Item
                        label="Sector"
                        name="sector"
                        hidden
                        initialValue={AddReportConfigStore.sector?._id!}
                        rules={[
                            { required: true, message: 'Please enter a report identifier' },
                        ]}
                    >
                        <Input hidden  />
                    </Form.Item>
                    <Form.Item
                        label="Sector"
                        name="sectorName"
                        initialValue={AddReportConfigStore.sector?.name!}
                        rules={[{ required: true, message: 'Please enter a report sector name' }]}
                    >
                        <Input readOnly  />
                    </Form.Item>
                    <Form.Item
                        label="Identifier"
                        name="identifier"
                        rules={[
                            { required: true, message: 'Please enter a report identifier' },
                            {
                                pattern: /^[^$.]+$/,
                                message: 'The identifier should not contain $ or .',
                            },
                            {
                                validator : async (_, value) => {
                                    const _values = [...flattenFields((await form.getFieldValue("fields")).filter(field => field.identifier))];
                                    const values=[ ..._values.map(field => field.identifier)];
                                    return uniqueValuesValidator(_, values);
                                }
                            }
                        ]}
                        
                    >
                        <Input placeholder="Unique report identifier" />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter a report name' },
                        ]}
                    >
                        <Input placeholder="Report name" />
                    </Form.Item>

                    <Form.Item
                        preserve={false}
                        label="Form Code"
                        name="form_code"
                        rules={[{ required: true, message: 'Please enter a form code' }]}
                    >
                        <Input placeholder="Form Code" />
                    </Form.Item>
                </Flex>

                {/* Recursive Fields */}
                <RecursiveField fieldPath="fields" form={form} />

                <Form.Item>
                    <Button  className="block me-0 ms-auto" type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )   
}

export default AddReportDrawer;