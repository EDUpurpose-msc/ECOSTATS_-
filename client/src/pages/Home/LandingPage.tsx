import { Card, Col, Flex, Image, Layout, List, message, Row, Select } from "antd";
import forestry_logo from "../../assets/forestry.png"
import bio_logo from "../../assets/bio.png"
import land_logo from "../../assets/land.png"
import logo from "../../assets/logo.png"
import Title from "antd/es/typography/Title";
import {PeopleAltOutlined, PeopleAltTwoTone, PhonelinkOutlined, PhonelinkTwoTone, SettingsSuggestTwoTone, SsidChartTwoTone} from '@mui/icons-material';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateYearOptions } from "../../services/helper";
import { useEffect, useState } from "react";
import { parseResError } from "../../services/errorHandler";
import { getHomeOverviewData, getReportOverviewData } from "../../services/api/sectorApi";
import { useAuthStore } from "../../stores/useAuthStore";


export const RenderReportOverview = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any>({});
    const [d, setD] = useState<any[]>([
        { name: 'Active', value:  0},
        { name: 'Inactive', value: 0 },
    ]);

    const init = async () => {
        try {
            const res = await getHomeOverviewData(year);  
            setData(res.data);
            setD([
                { name: 'Active', value:  res.data.activeUsers },
                { name: 'Inactive', value: res.data.inactiveUsers },
            ])
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        init(); 
    }, [year]);


    return (
        <>
            <Row justify="end" className="mb-4">
                <Col>
                    <Select
                    placeholder="Select Year"
                    value={year}
                    style={{ width: "100%" }}
                    options={generateYearOptions(2020, new Date().getFullYear())}
                    onChange={(y) => setYear(y)}
                    />
                </Col>
            </Row>
            <Card className="mb-4" title="Users Overview">
                <Row gutter={16}  justify={"center"} >
                    <Col xs={24} sm={24} md={16} lg={16} xl={16} >
                        <Row gutter={16} className="h-full" align={"stretch"}>
                            <Col span={12} className="mb-2">
                                <Card className="rounded-lg" >
                                    <Title level={4} className="text-xl font-bold mb-2 text-center">Total Users</Title>
                                    <p className="text-3xl font-semibold text-center">{data.totalUsers}</p>
                                </Card>
                            </Col>
                            <Col span={12} className="mb-2">
                                <Card className="rounded-lg" >
                                    <Title level={4} className="text-xl font-bold mb-2 text-center">Active Users</Title>
                                    <p className="text-3xl font-semibold text-center">{data.activeUsers}</p>
                                </Card>
                            </Col>
                            <Col span={24} >
                                <List
                                    className="h-full border-gray-100 rounded-lg"
                                    bordered
                                    dataSource={data.recentUsers}
                                    header={<div className="font-bold">Recently Added</div>}
                                    renderItem={(item : any) => (
                                        <List.Item>
                                            {item.name}
                                        </List.Item>
                                    )}
                                />
                            </Col>
                        </Row>
                        {/* <Row gutter={16} className="">
                        </Row> */}
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card className="rounded-lg h-full" >
                            <Title level={4} className="text-xl font-bold mb-2 text-center">Active and Inactive Users</Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart data={d}>
                                    <Pie
                                        dataKey={'value'}
                                        cx="50%"
                                        cy="50%"
                                        data={d}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                    >
                                        {d.map((entry, index) => (
                                            <Cell key={index} fill={entry.name === 'Active' ? 'green' : '#99CC99'} opacity={0.8} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
            </Card>
            <Card
                className="w-full"
                title="Sectors Overview"
            >
                

                <Row gutter={16} className="mb-4" justify={"center"}>
                    <Col span={8} >
                        <Card className="rounded-lg" >
                        <Title level={4} className="text-xl font-bold mb-2 text-center">Available Report Templates</Title>
                        <p className="text-3xl font-semibold text-center">{data.totalForms}</p>
                        </Card>
                    </Col>
                    <Col span={8} >
                        <Card className="rounded-lg" >
                        <Title level={4} className="text-xl font-bold mb-2 text-center">Total Configured Charts</Title>
                        <p className="text-3xl font-semibold text-center">{data.chartsCount}</p>
                        </Card>
                    </Col>
                </Row>
                
                <Title className="text-center" level={5}>Templates by Sector</Title>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        layout="vertical"
                        data={data.reportsBySectorData}
                    >
                        <CartesianGrid />
                        <YAxis width={200} type="category" dataKey="sector_name" label={{ value: 'Sectors',  angle: -90, dy: -10, position: 'insideLeft' }} />
                        <XAxis type="number" dataKey={"report_count"} label={{ value: 'Count', position: 'center', offset: 0, dy: 10 }}  />
                        <Legend verticalAlign="top" height={36} />
                        <Tooltip />
                        <Bar fillOpacity={0.8} dataKey="report_count" name={"Count"} label={{ position: "insideRight", fill: "#fff" }}  fill="green" />
                    </BarChart>
                </ResponsiveContainer>

                <br />

                <Title className="text-center" level={5}>Charts by Sector</Title>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        layout="vertical"
                        data={data.chartsBySectorData}
                    >
                        <CartesianGrid />
                        <YAxis width={200} type="category" dataKey="sector_name" label={{ value: 'Sectors',  angle: -90, dy: -10, position: 'insideLeft' }} />
                        <XAxis type="number" dataKey={"chartCount"} label={{ value: 'Count', position: 'center', offset: 0, dy: 10 }}  />
                        <Legend verticalAlign="top" height={36} />
                        <Tooltip />
                        <Bar fillOpacity={0.8} dataKey="chartCount" name={"Count"} label={{ position: "insideRight", fill: "#fff" }}  fill="green" />
                    </BarChart>
                </ResponsiveContainer>
                
            </Card>
        </>
    )
}

export const RenderGraphics = () => {
    return (
        <>
            <div className="w-full max-w-[1000px] mx-auto mb-4">
                <Card 
                    title="Sectors"
                >
                    <Row className="" justify="center" gutter={16}>
                        <Col className="w-90" style={{width: 200}}>
                            <Image src={forestry_logo} /> 
                            <Title className="text-center" level={5}>Forestry Management</Title>
                        </Col>
                        <Col className="w-90" style={{width: 200}}>
                            <Image src={bio_logo} /> 
                            <Title className="text-center" level={5}>Biodiversity Management</Title>
                        </Col>
                        <Col className="w-90" style={{width: 200}}>
                            <Image className="w-full" src={land_logo} width={200} height={200} /> 
                            <Title className="text-center" level={5}>Land Management</Title>
                        </Col>
                    </Row>
                </Card>
            </div>

            <div className="w-full max-w-[1000px] mx-auto mb-4" >
                <Card title="Features and Functions">
                    <Row className="my-15 justify-center">
                        <Col className="w-full max-w-lg">
                            {/* <Title className="text-center font-bold mt-4" level={4}>FEATURES AND FUNCTIONS</Title> */}
                            <Row justify="space-evenly">
                                <Col  className="w-28 text-center">
                                    <PeopleAltTwoTone className="text-center mx-auto" sx={{fontSize:100}} />
                                    <p className="text-center font-semibold">Statistical Focal  Registration</p>
                                </Col>
                                <Col className="w-28 text-center">
                                    <PhonelinkTwoTone className="text-center" sx={{fontSize:100}} />
                                    <p className="text-center font-semibold">Entering information or updating records</p>
                                </Col>
                                <Col className="w-28 text-center">
                                    <SettingsSuggestTwoTone className="text-center" sx={{fontSize:100}} />
                                    <p className="text-center font-semibold">Customized files and Reports</p> 
                                </Col>
                                <Col className="w-28 text-center">
                                    <SsidChartTwoTone className="text-center" sx={{fontSize:100}} />
                                    <p className="text-center font-semibold">Reports and Visualization</p>
                                </Col>
                            </Row>
                        </Col>
                        
                    </Row>
                </Card>
            </div>
        </>
    )
}

const LandingPage = () => {
    const authStore = useAuthStore();
    return (
        <Layout className="h-full overflow-scroll">
            <br />
            {
                !authStore.user && 
                (<RenderGraphics />)
            }


            {
                authStore.user && 
                (
                    <div className="w-full max-w-[1000px] mx-auto mb-4" >
                        <RenderReportOverview />
                    </div>
                )
            }

            <Card className="w-full max-w-[1000px] mx-auto mb-4" title="About Us">
                <Row className="mx-auto my-20 w-full" justify="center" gutter={[16, 16]} >
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div className="flex items-center h-full justify-center">
                            <div className="text-center">
                                {/* <Title level={4} className="text-3xl font-bold leading-tight">About Us</Title> */}
                                <p className="text-xl  leading-relaxed">
                                    The Department of Environment and Natural Resources (DENR) is committed to ensuring the sustainable management and development of the country's natural resources, promoting environmental protection, and enhancing the quality of life for present and future generations.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="text-center">
                        <Image width={250} src={logo} className="w-full max-w-lg mx-auto" />
                    </Col>
                </Row>
            </Card>
        </Layout>
    )
}

export default LandingPage;