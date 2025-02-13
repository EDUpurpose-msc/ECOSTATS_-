import { Badge, Button, Card, Dropdown, Flex, List, message, Popconfirm, Result, Select, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { generateYearOptionsFixed } from "../../../services/helper";
import { useEffect, useState } from "react";
import { sectorGetByQuery } from "../../../services/api/sectorApi";
import { parseResError } from "../../../services/errorHandler";
import { AddchartOutlined, AddOutlined, MoreHoriz, Update } from "@mui/icons-material";
import AddReportDrawer from "../../../components/Admin/Configurations/AddReportDrawer";
import { useAddReportConfigStore, useReportFieldsStore, useUpdateReportConfigStore, useUpdateReportNameStore } from "../../../stores/useReportConfigStore";
import { reportConfigDelete, reportConfigGetByQuery } from "../../../services/api/reportConfigApi";
import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import AddChart from "../../../components/Reports/AddChart";
import { useAddChartStore, useViewChartStore } from "../../../stores/useReportStore";
import ViewCharts from "../../../components/Reports/ViewCharts";
import UpdateReportDrawer from "../../../components/Admin/Configurations/UpdateReportDrawer";
import FieldsDrawer from "../../../components/Admin/Configurations/Fields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import UpdateReportNameDrawer from "../../../components/Admin/Configurations/UpdateReportNameDrawer";

const RenderConfigs = ({sectorId, refresh, setRefresh} : {sectorId : string, refresh:boolean, setRefresh : () => void}) => {
    const [configs, setConfigs] = useState<any[]>([]);
    const { setReportData } = useUpdateReportConfigStore();

    const viewChartStore = useViewChartStore();
    const addChartStore = useAddChartStore();
    const reportFieldsStore = useReportFieldsStore();
    const updateReportNameStore = useUpdateReportNameStore();

    const fetchConfigs = async () => {
        try {
            const _configs = (await reportConfigGetByQuery({sector : sectorId}, ["sector", { path: "charts", populate : { path: "color_scheme" }}])).data;
            setConfigs(_configs);
            console.log(_configs)
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }
    
    const handleDelete = async (id) => {
        try {
            await reportConfigDelete(id);
            message.success("Report Config deleted successfully.");
            setRefresh();
        } catch (error) {
            message.error(parseResError(error).msg, 10);
        }
    }


    useEffect(() => {
        fetchConfigs();
    }, [sectorId, refresh]);

    return (
        <List dataSource={configs} 
        className="mt-4"
        bordered
        renderItem={(config) => (
            <List.Item>
                <Flex className="w-full" justify="space-between" align="top">
                    <Flex vertical>
                        <p>
                            <span className="font-semibold">Name :</span> {config.name} 
                            <Button onClick={() => updateReportNameStore.setReportData(config)} size="small" type="link"><FontAwesomeIcon className="text-gray-500" icon={faEdit} /></Button>
                        </p>
                        <p><span className="font-semibold">Identifier :</span> <Typography.Text code>{config.identifier}</Typography.Text> </p> 
                        <p><span className="font-semibold">Form Code :</span> <Typography.Text code>{config.form_code ? config.form_code : "N/A"}</Typography.Text> </p> 
                    </Flex>
                    <Flex gap={4} className="h-fit">
                        <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this Report Configuration?" onConfirm={() => handleDelete(config._id)}>
                            <Button size="small" variant="solid" color="danger">Delete</Button>
                        </Popconfirm>
                        <Button size="small" onClick={() => reportFieldsStore.setReportData(config)} >Fields</Button>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: '1',
                                        label: (
                                            <>Add Chart</>
                                        ),
                                        icon : <PlusOutlined />,
                                        onClick : () => addChartStore.setConfig(config)
                                    },
                                    {
                                        key: '2',
                                        label: (
                                            <>View Charts <Badge className="ms-2" size="small" count={config.charts.length} color="primary" /></>
                                        ),
                                        icon : <BarChartOutlined />,
                                        onClick : () => viewChartStore.setCharts(config.charts)
                                    },
                                ],
                            }}
                        >
                            <Button size="small" icon={<BarChartOutlined />} >
                                Charts
                            </Button>
                        </Dropdown>
                    </Flex>
                </Flex>
            </List.Item>
        )} />
    )
}


const ReportConfiguration =  () =>  {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [sectors, setSectors] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const AddReportConfigStore = useAddReportConfigStore();
    

    const getSectors = async () => {
        try {
            const _sectors = (await sectorGetByQuery({calendar_year : year}, [])).data;
            setSectors(_sectors);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    const init = async () => {
        setLoading(true);
        await getSectors();
        setLoading(false);
    }

    const openAddForm = (sector) => {
        AddReportConfigStore.setSector(sector); 
    }

    
    useEffect(() => {
        init();
    }, [refresh, year]);

    const renderSectors = () => {
        return sectors.map((sector : any) => {
            return (
                <div key={sector._id} className="mb-8">
                    <Title level={5}>{sector.name}</Title>
                    <Space>
                        <Button type="primary" icon={<AddOutlined />} onClick={() => openAddForm(sector)}>Add Report</Button>
                    </Space>

                    <RenderConfigs setRefresh={() => setRefresh(!refresh)} refresh={refresh} sectorId={sector._id} />
                </div>
            )
        });
    }

    return (
        <div>
            <Title level={4}>Report Configuration</Title>
            <Space className="mb-4">
                <Button onClick={() => setRefresh(!refresh)}>Refresh</Button>
                <Select  placeholder="Select Year" options={generateYearOptionsFixed} value={year} onChange={(y) => setYear(y)}/>
                {/* <Button type="primary" onClick={showDrawer}>
                    Add Sector
                </Button> */}
            </Space>

            {
                sectors.length === 0 && <Result status="404" title="No Configurations found" />
            }

            { renderSectors() }

            <AddReportDrawer   />
            <AddChart onSave={() => setRefresh(!refresh)} />
            <ViewCharts onClose={() =>{ 
                setRefresh(!refresh)
                console.log("refresh")
                }}  />
            <UpdateReportDrawer onClose={() => setRefresh(!refresh)} />
            <FieldsDrawer onClose={() => setRefresh(!refresh)} />
            <UpdateReportNameDrawer />
        </div>
    );
}

export default ReportConfiguration;
