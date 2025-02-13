import { Button, Drawer, Form, Input, message, Select } from "antd"
import { useGenerateStore } from "../../../stores/useReportStore";
import { useEffect, useState } from "react";
import { generateYearOptionsFixed } from "../../../services/helper";
import { parseResError } from "../../../services/errorHandler";
import { sectorCopy, sectorGetByQuery } from "../../../services/api/sectorApi";
import _ from "lodash";


const Generate = ({onClose}) => {
    const { year, setYear } = useGenerateStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [sectors, setSectors] = useState<any[]>([]);

    const [form] = Form.useForm();

    const getSectors = async () => {
        setLoading(true);   
        try {
            const _sectors = (await sectorGetByQuery({}, [])).data;
            setSectors(_sectors);
        } catch (error) {
            message.error(parseResError(error).msg);
            onClose();
        } finally { 
            setLoading(false);
        }
    }

    useEffect(() => {
        if(year) {
            getSectors();
            form.setFieldsValue({for_year : year});
        }
    }, [year]);



    const handleSave = async () => {
        setIsSaving(true);
        const {base_on, for_year} = form.getFieldsValue();
        try {
            await sectorCopy(base_on, for_year);
            message.success("Configuration successfully copied.");
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false);
        }

    }

    return (
        <Drawer
            title="Copy Configuration"
            open={!!year}
            onClose={() => {
                setYear(null);
                form.resetFields();
                onClose();
            }}
            >
            <Form
                onFinish={handleSave}
                form={form}
            >
                <Form.Item 
                label="Based on Year" 
                name="base_on"
                rules={[{ required: true, message: 'Please enter a year' }]}>
                    <Select options={
                        _.uniqBy(sectors, 'calendar_year').map((s : any) => ({ label : s.calendar_year, value : s.calendar_year }))
                    } />
                </Form.Item>

                <Form.Item 
                label="For Year" 
                name="for_year"
                rules={[{ required: true, message: 'Please enter a year' }]}
                >
                    <Select options={generateYearOptionsFixed.filter((y : any) => !_.uniqBy(sectors, 'calendar_year').map((s : any) => s.calendar_year).includes(y.value))} />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" loading={isSaving} className="block ms-auto me-0" color="primary" variant="solid">Generate</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default Generate;