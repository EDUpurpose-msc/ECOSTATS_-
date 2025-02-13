import { Button, Card, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../../services/api/userApi";


const ResetPassword = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); // Create a form instance
    const [messageApi, contextHandler] = message.useMessage()

  const onFinish = async (values) => {
    setLoading(true);
    try {
        await resetPassword(values.password, token)
        messageApi.success("Password reset successfully.");
        form.resetFields(); // Clear the form fields
    } catch (error) {
        messageApi.error("Error resetting password. The link may have expired.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
        { contextHandler }
        <Flex justify="center" align="center" className="h-full"  >
            <Card title="Reset Password" style={{width:500}}>
                <Form
                form={form}
                name="reset-password"
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: 400, margin: "auto" }}
                >
                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[{ required: true, message: 'Please enter your new password!' }]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>
                <Form.Item>
                    <Button className="block ms-auto me-0" type="primary" htmlType="submit" loading={loading}>
                        Reset Password
                    </Button>
                </Form.Item>
                </Form>
            </Card>
        </Flex>
    </>
  );
}

export default ResetPassword;