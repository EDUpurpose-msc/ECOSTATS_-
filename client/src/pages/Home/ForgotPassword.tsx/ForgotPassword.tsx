import { Button, Card, Flex, Form, Input, message } from "antd"
import { parseResError } from "../../../services/errorHandler";
import { forgotPassword } from "../../../services/api/userApi";
import { useState } from "react";


const ForgotPassword = () => {
    const [form] = Form.useForm(); 
    const [messageApi, contextHandler] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const onFinish = async (e) => {
        setLoading(true)
        try {
            await forgotPassword(e);
            messageApi.success("Reset Link successfully sent.")
            form.resetFields();
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
        { contextHandler }
        <Flex className="h-full" justify="center" align="center">
            <Card style={{width: 500}} title="Forgot Password Form">
                <Form 
                form={form}
                onFinish={onFinish}
                layout="vertical">
                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: "Email is required"}
                    ]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading}  htmlType="submit" color="primary" variant="solid" className="block ms-auto me-0">Send Reset Email</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
        </>
    )
}

export default ForgotPassword;