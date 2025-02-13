import { Button, Collapse, Drawer, Flex, Form, message, Popconfirm, Space, Typography } from "antd"
import { useInsertFieldStore, useReportFieldsStore, useUpdateFieldsStore, useUpdateReportConfigStore } from "../../../stores/useReportConfigStore"
import UpdateField from "./UpdateField";
import { useEffect, useState } from "react";
import { parseResError } from "../../../services/errorHandler";
import { reportConfigDeleteField } from "../../../services/api/reportConfigApi";
import InsertField from "./InsertField";

const Text = Typography.Text;

const RecursiveFields = ({ fields } : { fields : any[] }) => {

    const [isDeleting, setIsDeleting] = useState(false);
    const { setStore, field } = useUpdateFieldsStore();
    
    const { reportData, setReportData } = useReportFieldsStore();

    const handleDelete = async (identifier) => {
        setIsDeleting(true);
        try {
            const d = (await reportConfigDeleteField(reportData._id, identifier)).data;
            setReportData(d);
            message.success("Field successfully deleted.");
        } catch (error) {
            message.error(parseResError(error).msg)
        } finally {
            setIsDeleting(false);
        }
    }
    

    return (
        <>
            {
                fields && fields.length > 0 &&
                fields.map((field, index) => (
                    <Collapse className="my-2"  key={index}>
                        <Collapse.Panel header={(
                            <Flex justify="space-between">
                                <Text>{field.name}</Text>
                            </Flex>
                            )}  
                            key={field.identifier}
                        >
                            <div key={index}>
                                <Flex justify="end" gap={4}>
                                    <Popconfirm title="Delete Field" description="Are you sure you want to delete this field?" onConfirm={() => handleDelete(field.identifier)}>
                                        <Button size="small" color="danger" variant="outlined" loading={isDeleting}>Delete</Button>
                                    </Popconfirm>
                                    <Button size="small" onClick={() => {
                                        setStore(reportData._id, field);
                                    }}>Edit</Button>
                                </Flex  >
                                <div><Text strong>Field Name : </Text><Text>{field.name}</Text></div>
                                <div><Text strong>Identifier : </Text><Text code>{field.identifier}</Text></div>
                                {
                                    field.is_nested ? (
                                        <div>
                                            <RecursiveFields fields={field.children} />
                                        </div>
                                    ) : (
                                        <div>
                                            <div><Text strong>Input Type : </Text><Text code>{field.input_type}</Text></div>
                                            <div><Text strong>Editable : </Text><Text code>{field.editable ? "True" : "False"}</Text></div>
                                            {
                                                (!field.editable && !field.computed_value) && (<div><Text strong>Default : </Text><Text>{field.default}</Text></div>)
                                            }
                                            {
                                                (!field.editable && field.computed_value) && (
                                                    <div>
                                                        <Text strong>Is Computed Value : </Text><Text code>{field.computed_value ? "True" : "False"}</Text><br />
                                                        <Text strong>Computed Values : </Text>
                                                        {
                                                            field.computed_values.map((value, index) => (
                                                                <Text code key={index}>{value}</Text>

                                                        ))}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                ))
            }
            
        </>
    )
}

const FieldsDrawer = ({onClose}) => {

    const store = useReportFieldsStore();
    const insertFieldStore = useInsertFieldStore();
    const [form] = Form.useForm();

    return (
        <Drawer 
            title={`Report Fields`}
            width="100%"
            onClose={() => {
                store.setReportData({});
                onClose();
            }}
            open={Object.keys(store.reportData).length > 0}
        >
            <RecursiveFields fields={store.reportData.fields} />
            <Button onClick={() => insertFieldStore.setReportData(store.reportData)}>Add Field</Button>
            <InsertField />
            <UpdateField />
        </Drawer>   
    )
}

export default FieldsDrawer;