import { Drawer, Form, Button } from 'antd';
import { GenericFormField } from '../types/forms/GenericFormTypes';


/**
 * GenericFormDrawer component.
 * Renders a Drawer with a form that dynamically creates input fields based on the given array of field configurations.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.visible - Whether the drawer is visible.
 * @param {Field[]} props.fields - The array containing field configurations.
 * @param {Function} props.onClose - The function to call when closing the drawer.
 * @param {Function} props.onSubmit - The function to call when submitting the form.
 */
const GenericFormDrawer: React.FC<{
  visible: boolean;
  fields: GenericFormField[];
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => void; // Use Record<string, any> for generic form values
}> = ({ visible, fields, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  // Handle form submission
  const handleFinish = (values: Record<string, any>) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Drawer
      title="Generic Form"
      width={400}
      onClose={onClose}
      open={visible}
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {fields.map(({ name, label, input }) => (
          <Form.Item
            key={name}
            label={label}
            name={name}
            rules={[{ required: true, message: `Please input your ${label}!` }]}
          >
            {input}
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};

export default GenericFormDrawer;
