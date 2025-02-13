
import { Drawer, Form, Input, Button, Checkbox, DatePicker } from 'antd';

/**
 * Converts a string like 'first_name' to 'First Name'.
 *
 * @param {string} text - The text to be formatted.
 * @returns {string} - The formatted text.
 */
const formatLabel = (text) => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * GenericFormDrawer component.
 * Renders a Drawer with a form that dynamically creates input fields based on the given object.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.visible - Whether the drawer is visible.
 * @param {Object} props.formData - The object containing the form fields.
 * @param {Function} props.onClose - The function to call when closing the drawer.
 * @param {Function} props.onSubmit - The function to call when submitting the form.
 */
const GenericFormDrawer = ({ visible, formData, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  // Handle form submission
  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  // Function to render input based on data type
  const renderInput = (key, value) => {
    const dataType = typeof value;

    switch (dataType) {
      case 'string':
        return <Input />;
      case 'number':
        return <Input type="number" />;
      case 'boolean':
        return <Checkbox />;
      case 'object':
        if (value instanceof Date) {
          return <DatePicker />;
        }
        // Handle more object types as needed
        return <Input />;
      default:
        return <Input />;
    }
  };

  return (
    <Drawer
      title="Generic Form"
      width={400}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={formData}
      >
        {Object.entries(formData).map(([key, value]) => (
          <Form.Item
            key={key}
            label={formatLabel(key)}
            name={key}
            rules={[{ required: true, message: `Please input your ${formatLabel(key)}!` }]}
          >
            {renderInput(key, value)}
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};

export default GenericFormDrawer;
