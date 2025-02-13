import { Button, Checkbox, Collapse, Drawer, Flex, Form, FormInstance, Input, message, Select, Space } from "antd"
import { useInsertFieldStore, useReportFieldsStore } from "../../../stores/useReportConfigStore";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { flattenFields } from "../../../services/helper";
import { reportConfigInsertField } from "../../../services/api/reportConfigApi";
import { parseResError } from "../../../services/errorHandler";

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
    const {reportData} = useInsertFieldStore();
    
    const handleIsNestedOnChange = (e) => {
        console.log(e.target.checked);
        setIsNested(e.target.checked);
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
                            const _values = [...flattenFields((await form.getFieldValue("children"))), ...flattenFields(reportData?.fields)];
                            const values=[ ..._values.map(field => field.identifier), form.getFieldValue("identifier")];
                            return uniqueValuesValidator(_, values);
                        }
                    }
                ]}
            >
                <Input placeholder="Unique field identifier" />
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
                                        <Input placeholder="Field name" />
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

const InsertField = () => {

    const { reportData , setReportData } = useInsertFieldStore();
    const reportFieldStore = useReportFieldsStore();
    const [form] = Form.useForm();
    const [flatFields, setFlatFields] = useState<any[]>([]);

    const [isSaving, setIsSaving] = useState(false);    

    const [isNested, setIsNested] = useState(false);
    const [editable, setEditable] = useState(false);
    const [inputType, setInputType] = useState("");
    
    const handleIsNestedOnChange = (e) => {
        console.log(e.target.checked);
        setIsNested(e.target.checked);
    }

    const handleIsEditableOnChange = (e) => {
        console.log(e.target.checked);
        setEditable(e.target.checked);
    }

    const handleInputTypeOnChange = (e) => {
        console.log(e);
        setInputType(e);
    }

    useEffect(() => {
        if (Object.keys(reportData).length > 0) {
            setFlatFields(flattenFields(reportData.fields));
            form.setFieldsValue({
                editable : false
            })
        }
    }, [reportData]);

    const handleSave = async () => {
        setIsSaving(true);
        const data = form.getFieldsValue();
        try {
            const d = (await reportConfigInsertField(reportData.id, data, data.position_identifier, data.position)).data;
            reportFieldStore.setReportData(d)
            message.success("Field successfully inserted.");
            setReportData({});
            form.resetFields();
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Drawer
            width="100%"
            open={Object.keys(reportData).length > 0}
            onClose={() => {
                setReportData({})
                form.resetFields();
            }}
            title="Insert Field"
        >
            
            <Form
                form={form}
                onFinish={handleSave}
            >
                <Form.Item
                    label="Position"
                    name="position"
                    rules={[{ required: true, message: 'Please select a position' }]}
                >
                    <Select 
                    placeholder="Select position" 
                    options={[
                        {
                            label  : "Before",
                            value  : "before"
                        },
                        {
                            label  : "After",
                            value  : "after"
                        }
                    ]} />
                </Form.Item>

                <Form.Item
                    label="Field"
                    name="position_identifier"
                    rules={[{ required: true, message: 'Please select a field' }]}
                >
                    <Select 
                    showSearch
                    placeholder="Select position" 
                    options={[...flatFields.map((field: any) => ({ label: field.name, value: field.identifier }))]} />
                </Form.Item>

                <hr className="mb-4" />

                <Form.Item
                    label="Field Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter a field name' }]}
                    >
                        <Input placeholder="Field Name" />
                </Form.Item>

                <Form.Item
                    preserve={false}
                    label="Identifier"
                    name={'identifier'}
                    rules={[
                        { required: true, message: 'Please enter an identifier' },
                        {
                            pattern: /^[^$.]+$/,
                            message: 'The identifier should not contain $ or .',
                        },
                        {
                            validator : async (_, value) => {
                                const _values = [...flattenFields((await form.getFieldValue("children"))), ...flattenFields(reportData?.fields)];
                                const values=[ ..._values.map(field => field.identifier), form.getFieldValue("identifier")];
                                return uniqueValuesValidator(_, values);
                            }
                        }
                    ]}
                >
                    <Input placeholder="Unique field identifier" />
                </Form.Item>
                
                <Form.Item
                    preserve={false}
                    name={'is_nested'}
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
                            name={'input_type'}
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
                                name={'editable'}
                                valuePropName="checked"
                                initialValue={false}
                            >
                                <Checkbox  onChange={handleIsEditableOnChange}>Is Editable</Checkbox>
                            </Form.Item>

                            {
                                !editable && (
                                    <Form.Item
                                        label="Default"
                                        preserve={false}
                                        name={'default'}
                                        rules={[{ required: true, message: 'Please enter the default value' }]}
                                    >
                                        <Input placeholder="Default Value" />
                                    </Form.Item>
                                )
                            }

                            {
                                inputType === "enum" 
                                && (
                                <Form.Item preserve={false} name={"values"} label="Values" rules={[{ required: true, message: 'Please add at least one value for the enum.' }]}>
                                    <Form.List  name={"values"} >
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
                    isNested && <RecursiveField fieldPath={'children'} form={form} />
                }

                <Form.Item>
                    <Button loading={isSaving} className="block ms-auto me-0" color="primary" variant="solid" htmlType="submit">Save</ Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default InsertField;