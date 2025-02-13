import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Form, Input, message } from "antd";
import { ColorPicker } from "antd"; // Ensure you're using the correct package
import { colorSchemeCreate } from "../../../services/api/colorSchemeApi";
import { useState } from "react";
import { parseResError } from "../../../services/errorHandler";

const AddColorScheme = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    const handleFinish = async (e) => {
        setIsSaving(true);
        try {
            const data = e;
            await colorSchemeCreate(data);
            form.resetFields();
            onClose();
            message.success("Color Scheme updated successfully.");
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Drawer
            title="Add Color Scheme"
            open={open}
            onClose={() => {
                form.resetFields(); // Reset all fields, including colors
                onClose();
            }}
            
        >
            <Form 
                form={form} 
                layout="horizontal"
                onFinish={handleFinish}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter a name" }]}
                >
                    <Input placeholder="Name" />
                </Form.Item>

                <Form.Item
                    name={"colors"}
                    rules={[
                        { 
                            validator: (_, value) => {
                                const colors = form.getFieldValue("colors") || [];
                                if (colors.length < 10) {
                                    return Promise.reject(new Error('Must have at least 10 colors'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Form.List name="colors">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field) => (
                                    <Form.Item
                                        key={field.key}
                                        label={`Color ${field.name + 1}`}
                                        style={{ display: "flex", alignItems: "center" }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                            <Form.Item
                                                {...field}
                                                name={field.name}
                                                noStyle
                                                rules={[{ required: true, message: "Please select a color" }]}
                                                // valuePropName=""
                                            >
                                                <ColorPicker 
                                                    format="hex" 
                                                    showText 
                                                    style={{ flex: 1, marginRight: 8 }} 
                                                    onChange={(color) => {
                                                        const hexValue = color.toHexString();
                                                        const currentValues = form.getFieldValue("colors") || [];
                                                        currentValues[field.name] = hexValue;
                                                        form.setFieldsValue({ colors: currentValues });
                                                    }}
                                                />
                                            </Form.Item>
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                onClick={() => remove(field.name)}
                                                style={{ cursor: "pointer", color: "#ff4d4f" }}
                                                role="button"
                                                tabIndex={0}
                                            />
                                        </div>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Color
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item>
                    <div style={{ textAlign: "right" }}>
                        <Button loading={isSaving} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default AddColorScheme;
