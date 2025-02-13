import { Button, Drawer, Form, Input, message } from "antd"
import { useUpdateReportConfigStore, useUpdateReportNameStore } from "../../../stores/useReportConfigStore";
import { useEffect, useState } from "react";
import { parseResError } from "../../../services/errorHandler";
import { reportConfigUpdate } from "../../../services/api/reportConfigApi";


const UpdateReportNameDrawer = () => {

    const { reportData, setReportData } = useUpdateReportNameStore();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        setIsSaving(true);
        try {
            await reportConfigUpdate({ _id : reportData._id, name : e.name, form_code : e.form_code }); 
            message.success("Report Config updated successfully.");
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        if(Object.keys(reportData).length > 0) {
            form.setFieldsValue({name : reportData.name, form_code : reportData.form_code});
        }
    })

    return (    
        <Drawer 
            onClose={() => setReportData({})}
            open={Object.keys(reportData).length > 0}
            title="Update Report Name"
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item 
                    label="Report Name" 
                    name="name" 
                    rules={[{ required: true, message: 'Please input the report name' }]}
                >
                    <Input type="text" />
                </Form.Item>
                <Form.Item 
                    label="Form Code" 
                    name="form_code" 
                    rules={[{ required: true, message: 'Please input the form code' }]}
                >
                    <Input type="text" />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" loading={isSaving}>Update</Button>
                </Form.Item>
            </Form>

        </Drawer>
    )
}

export default UpdateReportNameDrawer;