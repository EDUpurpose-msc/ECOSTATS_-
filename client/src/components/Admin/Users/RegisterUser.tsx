import { Button, Drawer, Form, Input, message, Select } from "antd";
import { useRegisterUserStore } from "../../../stores/useUserStore";
import { isEmailUsed, registerUser } from "../../../services/api/userApi";
import { useState } from "react";
import { parseResError } from "../../../services/errorHandler";


const RegisterUser = ({onFinish}) => {

    const [form] = Form.useForm();
    const { isOpen, setOpen } = useRegisterUserStore();
    const [ isSaving, setIsSaving ] = useState(false);

    const onClose = () => {
        form.resetFields();
        setOpen(false);
    }
    
    const handleFinish = async () => {
        setIsSaving(true);
        try {
            await registerUser(form.getFieldsValue());
            message.success("User registered successfully");
            form.resetFields();
            setOpen(false);
            onFinish();
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Drawer 
            size="large" 
            open={isOpen} 
            onClose={onClose}
            title="Register User"
            
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    name={"name"}
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name' }]}
                >
                    <Input type="text" />
                </Form.Item>

                <Form.Item
                    name={"email"}
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input a valid email' },
                        {
                            validator: async (_, value) => {
                                const isUsed = (await isEmailUsed(value)).data;
                                if(isUsed) {
                                    return Promise.reject(new Error("Email already in use"));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    name={"password"}
                    label="Password"
                    rules={[{ required: true, message: 'Please input a password' }]}
                >
                    <Input type="password" />
                </Form.Item>

                <Form.Item
                    name={"password_confirmation"}
                    label="Password Confirmation"
                    rules={[
                        { required: true, message: 'Please input the passsword confirmation' },
                        { 
                            validator: (_, value) => {
                                if (value && value !== form.getFieldValue("password")) {
                                    return Promise.reject(new Error("The two passwords that you entered do not match!"));
                                }
                                return Promise.resolve();
                            } 
                        }
                    ]}
                >
                    <Input type="password" />
                </Form.Item>

                <Form.Item
                    name={"role"}
                    label="Role"
                    rules={[{ required: true, message: 'Please input the role' }]}
                >
                    <Select placeholder="Select a role">
                        <Select.Option value="planning officer">Planning Officer</Select.Option>
                        <Select.Option value="chief">Chief</Select.Option>
                        <Select.Option value="focal">Focal</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" type="primary" loading={isSaving}>Register</Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export default RegisterUser;