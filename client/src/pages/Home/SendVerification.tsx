import { Button, Card, Flex, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import { parseResError } from "../../services/errorHandler";
import { resendEmailVerification } from "../../services/api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";


const SendVerification = () => {
    const [form] = useForm();
    const [messageApi, contextHandler] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const {email} = useParams();
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            await resendEmailVerification(e.email);
            messageApi.success("Verification email successfully sent.");
        } catch (error) {
            messageApi.error(parseResError(error).msg);
        } finally {
            setLoading(false);
        }
    }   

    useEffect(() => {
        if(authStore.user?.verifiedAt != null) {
            navigate(-1);
        }
    }, [authStore.user]);

    return (
        <>
            { contextHandler }
            <Flex className="h-full" justify="center" align="center">
                <Card className="w-full" style={{ maxWidth: 400 }}>
                    <Title level={4} className="text-center">Verify Account</Title>
                    <p className=" opacity-80">There might be a verification email sent to your email address. If you do not receive it, please check your spam folder or you can resend it. </p>
                    <Form layout="vertical" form={form} onFinish={handleSubmit}>
                        <Form.Item label="Email" name="email" initialValue={email}  rules={[{required: true, message: "Email is required"}]}>
                            <Input type="email" readOnly  />
                        </Form.Item>
                        <Form.Item>
                            <Button loading={loading} className="block ms-auto me-0" color="primary" variant="solid" htmlType="submit">Resend Verification</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Flex>
        </>
    )
}

export default SendVerification;