import { useEffect, useState } from "react";
import { Alert, Button, Drawer, Flex, message, Popconfirm, Select, Space, Table  } from "antd";
import Title from "antd/es/typography/Title";
import { deleteProgram, getAllPrograms } from "../../../services/api/programApi";
import { useProgramsStore, useUpdateProgramStore } from "../../../stores/useProgramStore";
import { useViewUnitsStore } from "../../../stores/useUnitStore";
import CreateUnit from "./CreateUnit";
import { parseResError } from "../../../services/errorHandler";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faPlus } from '@fortawesome/free-solid-svg-icons';
import UpdateProgram from "./UpdateProgram";
import { User } from "../../../types/User";

interface DataSource {
    key: string
    name: string
    management : string
    sector : any
    programHead : User
}

const ProgramLists = ({year} : { year : number }) => {
    const [ page, setPage ] = useState(1);
    const [ limit ] = useState(10);
    const [ total, setTotal ] = useState(0);
    const programStore = useProgramsStore();
    const [messageApi, contextHolder] = message.useMessage()
    const [dataSource, setDataSource] = useState<DataSource[]>([]);
    const [ isProgramsLoading, setIsProgramsLoading ] = useState(false);
    const viewUnitsStore = useViewUnitsStore();
    const [program, setProgram] = useState<{
        value : string,
        label : string
    } | null>(null);
    const updateProgramStore = useUpdateProgramStore();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Division Head',
            key: 'programHead',
            render : (record : DataSource) => {
                return (
                    <>
                        { record.programHead?.name }
                    </>
                );
            }
        },
        {
            title: 'Access Management',
            key: 'management',
            render : (record : DataSource) => {
                return record.sector.name
            }
        },
        {
            title: 'Units',
            key: 'progrmaHead',
            render : (record : DataSource) => {
                return (
                    <Space>
                        <Button size="small" onClick={() => viewUnitsStore.setProgram(record.key, record.name)}>Unit/s</Button>
                        <Button size="small" onClick={() => {
                            setProgram({value: record.key, label: record.name})
                        }}><FontAwesomeIcon icon={faPlus} />Add Unit</Button>
                    </Space>
                )
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render : (record : DataSource) => {
                return (
                    <Space>
                        <Button size="small" variant="text" color="primary" onClick={() => updateProgramStore.settProgramId(record.key)}>Update</Button>
                        <Popconfirm 
                        title="Delete Program" 
                        onConfirm={() => handleDeleteProgram(record.key)}
                        placement="right" 
                        description={"Are you sure you want to delete this division?"}>
                            <Button size="small" variant="text" color="danger">Delete</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        },
       
    ];
    const [refresh, setRefresh] = useState(false)

    const handleDeleteProgram = (id : string) => {
        deleteProgram(id).then(() => {
            programStore.setPrograms(programStore.programs.filter(p => p._id != id))
            messageApi.success("Program successfully deleted.")
        })
        .catch(err => {
            messageApi.error(parseResError(err).msg)
        })
        .finally();
    }

    useEffect(() => {
        setIsProgramsLoading(true)
        getAllPrograms(page, limit, year)
        .then(res => {
            programStore.setPrograms(res.data.programs)
            setTotal(res.data.total)
        })
        .catch(err => messageApi.error("Unexpected error occured while loading the programs."))
        .finally(() => {
            setIsProgramsLoading(false)
        });
        
    }, [page, refresh, year]);

    useEffect(() => {
        const d : any[]  = programStore.programs.map((val, i) => {
            return  {
                key: val._id,
                name: val.name,
                sector : val.sector,
                programHead : val.programHead
            }
        })
        setDataSource(d);
    }, [programStore.programs])

    return (
        <>
            {contextHolder}
            <Title level={5} >Divisions</Title>
            <Flex justify="right" className="mb-2">
                <Button variant="link" color="primary" size="small" icon={<FontAwesomeIcon icon={faArrowsRotate} />} onClick={() => setRefresh(!refresh)}>Refresh</Button>
            </Flex>
            <Table 
            sticky
            loading={isProgramsLoading}
            dataSource={dataSource} 
            columns={columns} 
            pagination={{
                current: page,
                pageSize: limit,
                total: total,
                onChange: (page) => setPage(page)
            }} />

            <Drawer open={!!program} onClose={() => setProgram(null)}>
                <CreateUnit program={program!} />
            </Drawer>

            <UpdateProgram onUpdated={(res) => setRefresh(!refresh)} />

        </>
    )
}

export default ProgramLists;
