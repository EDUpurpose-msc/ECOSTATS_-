import Title from "antd/es/typography/Title";
import { Button, Drawer, Flex, Form, Input, List, message, Popconfirm, Select, Space } from "antd";
import { generateYearOptionsFixed } from "../../../services/helper";
import { useEffect, useState } from "react";
import { sectorCreate, sectorDelete, sectorGet, sectorGetByQuery, sectorUpdate } from "../../../services/api/sectorApi";
import { parseResError } from "../../../services/errorHandler";
import { set } from "lodash";
import Generate from "../../../components/Admin/Configurations/Generate";
import { useGenerateStore } from "../../../stores/useReportStore";
import EditClassification from "../../../components/Admin/Configurations/EditClassification";

const AddSectorDrawer = ({
    visible,
    onClose,
    year
}: {
    visible: boolean;
    onClose: () => void;
    year : number
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        const fields = form.getFieldsValue();
        setLoading(true);
        try {
            const res = await sectorCreate(fields);
            form.resetFields();
            message.success("Sector added successfully");
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Add Sector"
            open={visible}
            onClose={onClose}
            footer={
                <Space>
                    <Button onClick={() => {
                        form.resetFields();
                        onClose()
                    }}>Cancel</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    initialValue={year}
                    label="Calendar Year"
                    name="calendar_year"
                    rules={[{ required: true }]}
                >
                    <Select  options={generateYearOptionsFixed} disabled />
                </Form.Item>
                <Form.Item
                    label="Identifier"
                    name="identifier"
                    rules={[
                        { required: true },
                        {
                            pattern: /^[^$.]+$/,
                            message: 'The identifier should not contain $ or .',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        className="block me-0 ms-auto"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const EditSectorDrawer = ({
    visible,
    onClose,
    _id
}: {
    visible: boolean;
    onClose: () => void;
    _id : String|null
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const getSector = async () => {
        setLoading(true);
        try {
            const res = await sectorGetByQuery({
                _id : _id
            }, []);
            console.log(res.data);
            form.setFieldsValue(res.data[0]);
        } catch (error) {
            message.error(parseResError(error).msg);    
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (_id) {
            getSector();
        }
    }, [_id]);

    const onFinish = async (values: any) => {
        const fields = form.getFieldsValue();
        fields._id = _id
        setLoading(true);
        try {
            const res = await sectorUpdate(fields);
            form.resetFields();
            message.success("Sector added successfully");
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Edit Sector"
            open={!!_id}
            onClose={onClose}
            footer={
                <Space>
                    <Button onClick={() => {
                        form.resetFields();
                        onClose()
                    }}>Cancel</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Calendar Year"
                    name="calendar_year"
                    rules={[{ required: true }]}
                >
                    <Select  options={generateYearOptionsFixed} disabled />
                </Form.Item>
                <Form.Item
                    label="Identifier"
                    name="identifier"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        className="block me-0 ms-auto"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const Sectors = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [sectors, setSectors] = useState<any[]>(["s", "asd"]);
    const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
    const [toEdit, SetToEdit] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [sectorToClassify, setSectorToClassify] = useState<string | null>(null);

    const generateStore = useGenerateStore();

    const getSectors = async () => {
        setLoading(true);
        try {
            const res = await sectorGetByQuery({calendar_year : year}, []);
            console.log(res.data);
            setSectors(res.data);
        } catch (error) {
            message.error(parseResError(error).msg);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getSectors();
    }, [year, refresh]);

    const showDrawer = () => {
        setAddFormVisible(true);
    };

    const onClose = () => {
        setAddFormVisible(false);
        setRefresh(!refresh)
    };


    const deleteSector = async (id : string) => {
        setLoading(true);
        try {
            const res = await sectorDelete(id);
            message.success("Sector deleted");
            setRefresh(!refresh);
        } catch (error) {
            message.error(parseResError(error).msg, 10);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            
            <Title level={4}>Sector Configuration</Title>
            <Space className="mb-4">
                <Button onClick={() => setRefresh(!refresh)}>Refresh</Button>
                <Select  placeholder="Select Year" options={generateYearOptionsFixed} value={year} onChange={(y) => setYear(y)}/>
                <Button type="primary" onClick={showDrawer}>
                    Add Sector
                </Button>
                {
                    sectors.length <= 0 && <Button variant="solid" color="primary" onClick={() => generateStore.setYear(year)}>Copy Configuration</Button>
                }
            </Space>
            <br/>
            <List
                loading={loading}
                className=""
                bordered
                dataSource={sectors}
                renderItem={sectors => (
                    <List.Item>
                        <Flex gap={10} justify="space-between" className="w-full" >
                            <div>
                                <Title level={5}>{sectors.name}</Title>
                                <p> Calendar Year : {sectors.calendar_year} </p>
                                <p> Name : {sectors.name} </p>
                                <p> Identifier : {sectors.identifier} </p>
                            </div>
                            <Flex gap={10} vertical>
                                <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this sector?" onConfirm={() => deleteSector(sectors._id)}>
                                    <Button color="danger" variant="filled">Delete</Button>
                                </Popconfirm>
                                <Button color="primary" variant="filled" onClick={() => SetToEdit(sectors._id)}>Edit</Button>
                                <Button color="primary" variant="filled" onClick={() => setSectorToClassify(sectors._id)}>Edit Classification</Button>
                            </Flex>
                        </Flex>
                    </List.Item>
                )}
            />
            <Generate onClose={() => {setRefresh(!refresh)}} />
            <AddSectorDrawer visible={addFormVisible} onClose={() => {onClose()}} year={year}/>
            <EditSectorDrawer visible={addFormVisible} onClose={() => {
                SetToEdit(null)
                onClose()
                }} _id={toEdit} />
            <EditClassification sector={sectorToClassify} onClose={() => setSectorToClassify(null)} />
        </div> 
    );
};

export default Sectors;
