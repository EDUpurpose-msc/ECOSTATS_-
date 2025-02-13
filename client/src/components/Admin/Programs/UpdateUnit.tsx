import { Button, Drawer, Flex, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { parseResError } from "../../../services/errorHandler";
import Title from "antd/es/typography/Title";
import { Program } from "../../../types/Program";
import { getUnitById, updateUnit } from "../../../services/api/unitApi";
import { useUpdateUnitStore } from "../../../stores/useUnitStore";

interface Props {
    onUpdated? : (program : Program) => any
}

const UpdateUnit = ({onUpdated} : Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const store = useUpdateUnitStore();

    const submitForm = (e) => {
        setIsSaving(true)
        updateUnit(e.id, e.name)
        .then(res => {
            store.clear();
            messageApi.success("Program updated successfully");
            if(onUpdated){
                onUpdated(res.data)
            }
        })
        .catch(err => {
            if(err.response.status == 422){
                store.errors = err.response.data.errors;
            }
            else {
                messageApi.error(parseResError(err).msg);
            }
        })
        .finally(() => setIsSaving(false))
    }
    
    useEffect(() => {
        if(store.unitId){
            setLoading(true)
            getUnitById(store.unitId)
            .then(res => {
                store.setUnit(res.data);
                
            })
            .catch(err => {
                messageApi.error(parseResError(err).msg);
            })
            .finally(() => setLoading(false))
        }
    }, [store.unitId])

    return (
        <>
            { contextHolder }
            <Drawer 
            onClose={() => store.clear()}
            loading={loading}
            
            open={!!store.unitId}>
                <Title level={5} >Update Unit</Title>
                
                <Form   
                onFinish={submitForm}
                layout="vertical"
                initialValues={store.formData}>
                    <Form.Item 
                    rules={[{required: true}]}
                    name="id"
                    hidden
                    >
                        <Input   />
                    </Form.Item>

                    <Form.Item 
                    label="Unit Name" 
                    rules={[{required: true}]}
                    name="name"
                    
                    >
                        <Input placeholder="Unit Name"    />
                    </Form.Item>

                    <Form.Item>
                        <Flex justify="end">
                            <Button htmlType="submit" variant="solid" color="primary" loading={isSaving}> Save</Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default UpdateUnit;