import { icon } from "@fortawesome/fontawesome-svg-core";
import { Button, Checkbox, Col, Collapse, Drawer, Flex, Form, FormInstance, Input, List, message, Row, Select, Space, Tree, Typography } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { flattenFields } from "../../../services/helper";
import { sectorGetByQuery } from "../../../services/api/sectorApi";
import { parseResError } from "../../../services/errorHandler";
import { create } from "zustand";
import _ from "lodash";
import { classificationCreate, classificationGetByQuery, classificationUpdate } from "../../../services/api/classificationApi";

const uniqueValuesValidator = async (_, values) => {
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
        return Promise.reject(new Error('Values must be unique.'));
    }
    return Promise.resolve();
}

export const flattenReports = (data) => {
    // Helper function to recursively flatten reports from classifications
    const extractReports = (classifications) => {
        return _.flatMap(classifications, (classification) => {
            const reports = classification.reports || [];
            const nestedClassifications = classification.classifications || [];
            // Flatten the current reports and recursively extract nested classifications
            return [
                ...reports,
                ...extractReports(nestedClassifications),
            ];
        });
    };

    // Start by extracting reports from the top-level classifications
    return extractReports(data.classifications);
};

const _store = create<{
    unclassifiedReports : any[]
    reports : any[]
    setUnclassifiedReports : (reports:any[]) => void
    setReports : (reports:any[]) => void
}>((set) => ({
    unclassifiedReports : [],
    reports : [],
    setUnclassifiedReports : (reports:any[]) => set({unclassifiedReports : reports}),
    setReports : (reports : any[]) => set({reports : reports})
}));


const IsNestedComponent = ({fieldName, form}) => {
    const store = _store();

    const setUnclassifiedReports = () => {
        const classifiedReports : any[] = flattenReports(form.getFieldsValue());
        store.setUnclassifiedReports(store.reports.filter(a => !classifiedReports.includes(a._id)));
    }

    const handleSelect = (e) => {
        console.log(e)
        console.log(flattenReports(form.getFieldsValue()));
        setUnclassifiedReports();
    }

    return (
        <>
            <Form.List name={[fieldName, 'reports']} >
                {(fields, { add, remove }) => {
                    return (
                    <div>
                        {
                            fields.map((field, index) => {
                                return (
                                    <Flex key={field.key} justify="space-between" align="baseline" gap={2}>
                                        <Form.Item
                                            // preserve={false}
                                            // label="Report"
                                            // layout="vertical"
                                            name={[field.name]}
                                            className="w-full"
                                            rules={[{ required: true, message: 'Please add at least one Report.' }]}
                                        >
                                            <Select
                                                style={{ width: '100%' }}
                                                placeholder="Select report"
                                                showSearch
                                                optionFilterProp="label"
                                                options={store.reports.map((report) => {
                                                    if(store.unclassifiedReports.includes(report)){
                                                        return {
                                                            label : report.name,
                                                            value : report._id
                                                        }
                                                    }
                                                    return {
                                                        label : report.name,
                                                        value : report._id,
                                                        disabled : true
                                                    }
                                                })}
                                                onSelect={handleSelect}
                                            /> 
                                        </Form.Item >
                                        <MinusCircleOutlined className="text-red-500" onClick={() => {
                                                remove(field.name);
                                                setUnclassifiedReports();
                                            }} style={{ cursor: 'pointer' }} />
                                    </Flex>
                                )
                            })
                        }

                        {/* Add Field Button */}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            className="mb-2"
                            icon={<PlusOutlined />}
                        >
                            Add Report
                        </Button>
                    </div>
                    )
                }}
            </Form.List>
            <RecursiveField fieldPath={[fieldName, 'classifications']} form={form} />
        </>
    )
}

const RecursiveField = ({ fieldPath, form } : { fieldPath: any, form: FormInstance }) => {
    const store = _store();
    return (
        <Form.Item
            // preserve={false}
            // label="Classifications"
            name={fieldPath}
            rules={[
                {
                    validator : async (_, values) => {
                        if(fieldPath[0] == "classifications" && values.length <= 0){
                            return Promise.reject("Please provide atleast one classifications")
                        }
                        return Promise.resolve();
                    }
                }
            ]}
        >
            
            <Form.List name={fieldPath} initialValue={[]} >
                {(fields, { add, remove }) => {
                    return (
                    <div>
                        {fields.map((field, index) => {
                            return (
                            <Collapse key={field.key} className="mb-2 hover:bg-slate-100 hover:border-slate-300" >
                                <Collapse.Panel header={`Classification ${index + 1}`} key={field.key} extra={(
                                        <Button
                                            variant="dashed"
                                            color="danger"
                                            onClick={() => remove(field.name)}
                                            icon={<MinusCircleOutlined />}
                                        >
                                            Remove Classification
                                        </Button>
                                    )}>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <Form.Item
                                        // preserve={false}
                                        label="Classification Name"
                                        name={[field.name, 'name']}
                                        rules={[{ required: true, message: 'Please enter a classification name' }]}
                                    >
                                        <Input  placeholder="Classification name" />
                                    </Form.Item>

                                    <IsNestedComponent fieldName={field.name} form={form} />

                                </Space>
                                </Collapse.Panel>
                            </Collapse>
                            )
                        })
                        }
            
                        {/* Add Field Button */}
                        <Form.Item 
                            // preserve={false}
                        >
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                        >
                            Add Classification
                        </Button>
                        </Form.Item>
                    </div>
                    )}
                }
            </Form.List>
        </Form.Item>
    );
            
};

const EditClassification = ({
    sector,
    onClose
} : {
    sector : string | null,
    onClose : () => void
} ) => {

    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);
    const store = _store();

    const init = async () => {
        try {
            const res = await sectorGetByQuery({_id : sector}, ["configs"]);
            const classification = (await classificationGetByQuery({sector_id : sector}, [])).data[0];
            console.log(classification);
            store.setReports(res.data[0].configs);
            if(classification){
                form.setFieldsValue(classification);
                setUnclassifiedReports();
            } 
            else{
                store.setUnclassifiedReports(res.data[0].configs);
            }
            
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    const setUnclassifiedReports = () => {
        const classifiedReports : any[] = flattenReports(form.getFieldsValue());
        store.setUnclassifiedReports(store.reports.filter(a => !classifiedReports.includes(a._id)));
    }

    useEffect(() => {
        if(sector !== null){ 
            init();
        }
    }, [sector]);

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            const data = form.getFieldsValue();
            data.sector_id = sector;
            console.log(data)
            await classificationCreate(data);
            onClose();
            form.resetFields();
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setIsSaving(false);
        }
    }


    return (
        <Drawer 
            width={"100%"}
            size="large" 
            title="Edit Classification"
            open={sector !== null}
            onClose={() => {
                form.resetFields();
                onClose(); 
            }}
        >
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            name={"sector_id"}
                            hidden
                            initialValue={sector}
                        >
                            <Input type="hidden" />
                        </Form.Item>

                        <RecursiveField form={form} fieldPath={['classifications']} />
                        
                        <Form.Item>
                            <Button loading={isSaving} type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8}>
                    <List
                        header={<div className="font-semibold">Unclassified Reports</div>}
                        dataSource={store.unclassifiedReports}
                        bordered
                        renderItem={(report) => (
                            <List.Item>
                                <Typography.Text>{report.name}</Typography.Text>
                            </List.Item>
                        )}
                        // style={{ overflow: 'auto', maxHeight: 600 }}
                    />
                </Col>
            </Row>


        </Drawer>
    )
}
    
export default EditClassification;