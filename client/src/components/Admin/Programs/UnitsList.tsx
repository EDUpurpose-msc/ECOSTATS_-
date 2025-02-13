import { useCallback, useEffect, useState } from "react";
import { Button, Card, Drawer, Flex, Form, Input, List, message, Popconfirm, Select, Space, Table } from "antd";
import { useUpdateUnitStore, useViewFocalsStore, useViewUnitsStore } from "../../../stores/useUnitStore";
import { addFocalPerson, deleteUnit, getByProgram, getFocalPersons, getUnitById, removeFocal } from "../../../services/api/unitApi";
import Title from "antd/es/typography/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { parseResError } from "../../../services/errorHandler";
import UpdateUnit from "./UpdateUnit";
import { User } from "../../../types/User";
import { Unit } from "../../../types/Unit";
import { debounce } from "lodash";
import { getByQuery, searchUserByName } from "../../../services/api/userApi";
import { Program } from "../../../types/Program";
import { getProgramById } from "../../../services/api/programApi";

const ViewFocals = () => {
    const viewFocalsStore = useViewFocalsStore();
    const [ messageApi, contextHandler ] = message.useMessage();
    const [ open, setOpen ] = useState(false);
    const [ focals, setFocals ] = useState<any>([]);
    const [ unit, setUnit ] = useState<Unit|null>(null);
    const [ program, setProgram ] = useState<Program|null>(null);
    const [loading, setLoading] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [addFocalForm] = Form.useForm();
    const [selectUserloading, setSelectUserloading] = useState(false);

    const onLoad = async () => {
        setLoading(true)
        try {
            const res1 = await getUnitById(viewFocalsStore.unitId!);
            setUnit(res1.data);
            const res2 = await getFocalPersons(viewFocalsStore.unitId!);
            setFocals(res2.data);
            const res3 = await getProgramById(res1.data.programId);
            setProgram(res3.data);
            console.log(res3.data);
        } catch (error) {
            message.error("Unexpected Error occured");
            messageApi.error(parseResError(error).msg);
        }
        finally {
            setLoading(false)
        }
    }

    const searchUser = (e) => {
        debouncedUserSearch(e)
    }

    const debouncedUserSearch = useCallback(
        debounce((value) => {
            setSelectUserloading(true)
            getByQuery({
                _id : {
                    $nin : [unit?.unitHead, ...focals.map(val => val.focalPerson?._id), program?.programHead]
                },
                name : {
                    $regex : value,
                    $options : "i"
                },
                role : {
                    $in : ["chief", "focal"]
                }
            })
            .then(res => {
                console.log(res.data)
                const options = res.data.map(val => {
                    return {
                        value : val._id,
                        label : val.name,
                        email : val.email
                    }
                });
                setUserOptions(options)
            })
            .catch(err => {
                messageApi.error("Unexpected Error occured")
            })
            .finally(()=>{
                setSelectUserloading(false)
            })
        }, 500)
    ,[]);

    const optionRenderer = (option) => {
        return (
            <>
                <p>{option.label}</p>
                <p className="opacity-80">{option.data.email}</p>
            </>
        )
    }

    const handleAddFocal = async () => {
        await addFocalForm.validateFields();
        const fields = addFocalForm.getFieldsValue();
        try {
            await addFocalPerson(unit?._id!, fields.userId, fields.position)
            messageApi.success("Focal Person successfully added.")
            addFocalForm.resetFields()
            onLoad()
        } catch (error) {
            console.log(error)
            messageApi.error(parseResError(error).msg)
        }

    }

    const handleRemoveFocal = async (id) => {
        try {
            await removeFocal(id);
            messageApi.success("Focal person successfully removed.");
            onLoad()
        } catch (error) {
            messageApi.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        setOpen(!!viewFocalsStore.unitId)
        if(viewFocalsStore.unitId){
            onLoad();
        }
        else{
            addFocalForm.resetFields();
            // setUnit(null)
            // setFocals([])
        }
    }, [viewFocalsStore.unitId])


    return (
        <>
            { contextHandler }
            <Drawer
            loading={loading}
            title={`${unit?.name} Focals`}
            onClose={() => viewFocalsStore.setUnitId(null)}
            open={open}>
                <Form  form={addFocalForm} layout="vertical">
                    <Title level={5}>Add Focal Person</Title>
                    <Form.Item 
                    label="Position" 
                    name="position"
                    rules={[{required: true, message: 'Position is required.'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item 
                    name="userId"
                    label="User" 
                    rules={[{required: true, message: 'User is required.'}]}>
                    <Select 
                        showSearch
                        allowClear
                        loading={selectUserloading}
                        className="w-full" 
                        placeholder="Search User Account"
                        filterOption={false}
                        onSearch={searchUser} 
                        onClear={()=>{
                            setUserOptions([])
                        }}  
                        options={userOptions.map(opt => opt)} 
                        optionRender={(option) => optionRenderer(option)}/>
                    </Form.Item>
                    <Form.Item >
                        <Button variant="solid" color="primary" className="w-full" onClick={handleAddFocal}>Save</Button>
                    </Form.Item>
                </Form>
                <br />
                <List >
                    <Title level={5}>Focal Persons</Title>
                    {
                        focals.map(f => {
                            return (
                                <List.Item key={f._id}>
                                    <Flex justify="space-between" className="w-full">
                                        <div className="">
                                            <div className="font-semibold">{f.userId.name}</div>
                                            {f.position}
                                        </div>
                                        <Popconfirm  title="Remove Focal" description="Are you sure to remove this focal?" onConfirm={() => handleRemoveFocal(f._id)}>
                                            <Button color="danger" variant="text" size="small" >Remove</Button>
                                        </Popconfirm>
                                    </Flex>
                                </List.Item>
                            )
                        })
                    }
                    {
                        focals.length == 0 && "No Focals to show"
                    }
                </List>
            </Drawer>
        </>
    )
}

interface DataSource {
    key: string
    name: string
    unitHead : User
}

const UnitsList = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const [dataSource, setDataSource] = useState<DataSource[]>([]);
    const [ isUnitsLoading, setIsUnitsLoading ] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const viewUnitStore = useViewUnitsStore();
    const updateUnitStore = useUpdateUnitStore();
    const viewFocalsStore = useViewFocalsStore();

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Unit Head',
            key: 'unitHead',
            render : (record : DataSource) => {
                return (
                    <>
                        { record.unitHead?.name }
                    </>
                );
            }
        },
        {
            title: 'Focal Persons',
            key: 'unitMembers',
            render : (record : DataSource) => {
                return <Button size="small" onClick={() => viewFocalsStore.setUnitId(record.key)}>Focal Persons</Button>
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render : (record : DataSource) => {
                return (
                    <Space>
                        <Button size="small" variant="text" color="primary" onClick={() => updateUnitStore.setUnitId(record.key)}>Update</Button>
                        <Popconfirm title="Delete Unit" description="Are you sure you want to delete this unit?" onConfirm={() => handleDeleteUnit(record.key)}>
                            <Button size="small" variant="text" color="danger">Delete</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        },
       
    ];

    const handleDeleteUnit = (id : string) => {
        deleteUnit(id)
        .then(() => {
            viewUnitStore.setUnits(viewUnitStore.units.filter(p => p._id != id))
            messageApi.success("Unit successfully deleted.")
            setRefresh(!refresh)
        })
        .catch(err => {
            messageApi.error(parseResError(err).msg)
        })
        .finally();
    }

    useEffect(() => {
        if(viewUnitStore.programId){
            setIsUnitsLoading(true);
            getByProgram(viewUnitStore.page, viewUnitStore.limit, viewUnitStore.programId)
            .then(res => {
                console.log(res)
                viewUnitStore.setUnits(res.data.units)
                viewUnitStore.setTotal(res.data.total)
            })
            .catch(err => {
                messageApi.error("Unexpected error occured while loading the programs.")
            })
            .finally(() => {
                setIsUnitsLoading(false)
            });
        }
        
    }, [viewUnitStore.page, viewUnitStore.programId, refresh]);

    useEffect(() => {
        console.log(viewUnitStore.units)
        const d : any[]  = viewUnitStore.units.map((val) => {
            return  {
                key: val._id,
                name: val.name,
                unitHead : val.unitHead
            }
        })
        setDataSource(d);
        location.href = "/admin/programs#unitsTable"
    }, [viewUnitStore.units])

    return (
        <>
            {contextHolder}
            <Title level={5} >Units</Title>
            {
                viewUnitStore.programId && <div className="mb-2"><span className="font-semibold">Division :</span> {viewUnitStore.programName}</div> 
            }
            <Flex justify="right" className="mb-2">
                <Button variant="text" color="primary" type="text" size="small" icon={<FontAwesomeIcon icon={faArrowsRotate} />} onClick={() => setRefresh(!refresh)}>Refresh</Button>
            </Flex>
            <Table 
            id="unitsTable"
            sticky
            locale={{
                emptyText : viewUnitStore.programId ? "No Units under this program" : "Select a program above to view units."
            }}
            loading={isUnitsLoading}
            dataSource={dataSource} 
            columns={columns} 
            pagination={{
                current: viewUnitStore.page,
                pageSize: viewUnitStore.limit,
                total: viewUnitStore.total,
                onChange: (page) => viewUnitStore.setPage(page)
            }} />

            <UpdateUnit onUpdated={() => setRefresh(!refresh)} />
            <ViewFocals />
        </>
    )
}

export default UnitsList;