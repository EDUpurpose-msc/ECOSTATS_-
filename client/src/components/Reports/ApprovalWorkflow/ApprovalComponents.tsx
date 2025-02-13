import { Button, Drawer, Form, message, Steps } from "antd"
import { useAddCommentStore, useViewLogsStore } from "../../../stores/useReportStore"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { parseResError } from "../../../services/errorHandler";
import { addComment, getLogsByQuery } from "../../../services/api/formsApi";
import { useAuthStore } from "../../../stores/useAuthStore";


export const AddComment = () => {
    const store = useAddCommentStore();
    const authStore = useAuthStore();
    const [messageApi, contextHandler] = message.useMessage();
    const [form] = Form.useForm();

    const handleSave = async () => {
        await form.validateFields();
        const fields = form.getFieldsValue();

        try {
            const data = {
                comment : fields.comment,
                message : `${authStore.user?.name} commented.`,
                reportId : store.reportId
            }
            await addComment(data)
            form.resetFields();
            store.setReportId(null);
            messageApi.success("Comment successfully added.");
        } catch (error) {
            messageApi.error(parseResError(error).msg);
        }
        console.log(fields)
    }

    return (
        <>
            { contextHandler }
            <Drawer title="Add Comment" open={!!store.reportId} onClose={() => store.setReportId(null)}>
                <Form form={form} layout="vertical">
                    <Form.Item
                    name="comment"
                    label="Comment"
                    rules={[{required:true, message: "Comment is required."}]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Button onClick={handleSave} className="block mr-0 ml-auto" color="primary" variant="solid">Save</Button>
                </Form>
            </Drawer>
        </>
    )
}

export const ViewLogs = () => {
    const [messageApi, contextHandler] = message.useMessage();
    const store = useViewLogsStore();
    const [ logs, setLogs ] = useState<any[]>([]);

    const init = async () => {
        try {
            const reportLogs = (await getLogsByQuery({
                reportId : store.reportId
            }, [])).data;
            console.log(reportLogs)
            setLogs(reportLogs)
        } catch (error) {
            messageApi.error(parseResError(error).error)
        }
    }

    useEffect(() => {
        if(store.reportId){
            init()
        }
    }, [store.reportId]);

    return (
        <>
            { contextHandler }
            <Drawer title="Report Logs" open={!!store.reportId} onClose={() => store.setReportId(null)}>
                <Steps
                progressDot
                direction="vertical"
                items={
                    logs.map(l => {
                        return {title: l.message, description: l.comment, subTitle: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(l.createdAt))}
                    })
                } />
            </Drawer>
        </>
    )
}