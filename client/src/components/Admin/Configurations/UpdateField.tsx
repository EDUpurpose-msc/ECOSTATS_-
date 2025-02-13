import { Alert, Button, Checkbox, Drawer, Flex, Form, Input, message, Select } from "antd"
import { useReportFieldsStore, useUpdateFieldsStore } from "../../../stores/useReportConfigStore";
import { useEffect, useState } from "react";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { parseResError } from "../../../services/errorHandler";
import { reportDataGetByQuery } from "../../../services/api/reportDataApi";
import { reportConfigUpdateField } from "../../../services/api/reportConfigApi";


const UpdateField = () => {
    const { report_config_id, field, clear, setStore } = useUpdateFieldsStore();
    const reportFieldStore = useReportFieldsStore();
    const [form] = Form.useForm();
    const [inputType, setInputType] = useState<string>("");
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const uniqueValuesValidator = async (_, values) => {
        const uniqueValues = new Set(values);
        if (uniqueValues.size !== values.length) {
            return Promise.reject(new Error('Values must be unique.'));
        }
        return Promise.resolve();
    }

    const handleSave = async () => {
        setIsSaving(true)
        const data = form.getFieldsValue();
        try {
            const d = (await reportConfigUpdateField(report_config_id, data, field.identifier)).data;
            reportFieldStore.setReportData(d);
            message.success("Field successfully updated.");
            form.resetFields();
            clear();
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false)
        }
    }

    const init = async () => {
        setLoading(true);
        try {
            const _data = (await reportDataGetByQuery({report_config_id : report_config_id}, [])).data;
            setData(_data);
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(Object.keys(field).length > 0){
            setInputType(field.input_type);
            setIsEditable(field.editable);
        }
        form.setFieldsValue(field);
    }, [field]);

    useEffect(() => {
        if(report_config_id !== "") {
            init();
        }
    }, [report_config_id]);
    
    return (
        <Drawer
            loading={loading}
            title="Update Field"
            open={Object.keys(field).length > 0}
            onClose={() => {
                form.resetFields();
                clear()
            }}
        >
            <Form 
            form={form}
            onFinish={handleSave}
            >
                {
                    data.length > 0 && (
                        <Alert type="error" message="Note: Some configuration cannot be updated as the report already contains data entries. Please remove existing data to proceed with other updates." className="mb-5"  />
                    )
                }

                <Form.Item
                initialValue={report_config_id}
                hidden
                name="report_config_id"
                >
                    <Input type="hidden" />
                </Form.Item>

                <Form.Item
                label="Field Name"
                initialValue={field.name}
                name="name"
                rules={[{ required: true, message: 'Please enter a field name' }]}
                >
                    <Input type="text" />
                </Form.Item>

                
                {
                    (!field.is_nested && data.length <= 0) && (
                        <div>
                            <Form.Item
                            name="input_type"
                            label="Input Type"
                            initialValue={field.input_type}
                            >
                                <Select  onChange={(e) => setInputType(e)} options={[
                                    { label: "Text", value: "text" }, 
                                    { label: "Number", value: "number" }, 
                                    { label: "Date", value: "date" }, 
                                    { label: "Enum", value: "enum" }]}  
                                />
                            </Form.Item>
                            {
                                inputType === "enum" && (
                                    <Form.Item preserve={false} label="Values" >
                                        <Form.List name="values"  >
                                            {(fields, { add: addValue, remove: removeValue }) => (
                                                <Flex vertical gap={5}>
                                                    {fields.map((field, index) => (
                                                        <Flex gap={5} key={index} align="baseline">
                                                            <Form.Item
                                                                className="w-full"
                                                                {...field}
                                                                preserve={false}
                                                                name={field.name}
                                                                rules={[
                                                                    { required: true, message: 'Missing value' },
                                                                    {
                                                                        validator : async (_, value) => {
                                                                            const values = (await form.getFieldValue("values")) || [];
                                                                            return uniqueValuesValidator(_, values);
                                                                        }
                                                                    }
                                                                ]}
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
                            <Form.Item
                                name="editable"
                                valuePropName="checked"
                            >
                                <Checkbox onChange={(e) => setIsEditable(e.target.checked)} >Editable</Checkbox>
                            </Form.Item>

                            {
                                !isEditable && 
                                <Form.Item
                                    label="Default"
                                    name="default"
                                    rules={[{ required: true, message: 'Please enter a default value' }]}
                                    initialValue={field.default}
                                >
                                    <Input type="text" />
                                </Form.Item>
                            }
                        </div>
                    )   
                }

                <Form.Item >
                    <Button loading={isSaving} htmlType="submit" className="block ms-auto me-0" color="primary" variant="solid">Save</Button>
                </Form.Item>

            </Form>
        </Drawer>
    )
}

export default UpdateField;