import { Card, Col, Layout, message, Row, Select, Statistic } from "antd";
import Title from "antd/es/typography/Title";
import penro from "../../../public/penro.jpg";
import Time from "../../components/Time";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { parseResError } from "../../services/errorHandler";
import { getSectorChartCountsData } from "../../services/api/sectorApi";
import { generateYearOptions } from "../../services/helper";
import { getAdminOverviewData } from "../../services/api/userApi";


const RenderChart1 = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any>({});

    const init = async () => {
        try {
            const res = await getAdminOverviewData(year);
            setData(res.data);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {  
        init();
    }, [year]);

    return (
        <Card className="mb-4" title="Divisions and Units" bordered={false}>
            <div style={{ textAlign: 'right' }}>
                <Select placeholder="Select Year" className="w-20" value={year} onChange={(y) => setYear(y)} options={[...generateYearOptions(2020, new Date().getFullYear())]} />
            </div>
            <Row gutter={16} style={{marginTop: '1em'}} >
                <Col className="mb-2" xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Total Users" value={data.total_users} />
                    </Card>
                </Col>
                <Col className="mb-2" xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Total Divisions" value={data.total_programs} />
                    </Card>
                </Col>
                <Col className="mb-2" xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Total Units" value={data.total_units} />
                    </Card>
                </Col>
            </Row>
            <Title level={5} className="mt-4 text-center">No. of Members By Division</Title>
            <ResponsiveContainer width={"100%"} height={500}  >
                <BarChart layout="vertical" data={data.divisionChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                    <CartesianGrid />
                    <XAxis  name="Focal Count" type="number" dataKey={"focalCount"} label={{ value: 'Focal Count', position: "center", offset: 0, dy: 15, }}  /> 
                    <YAxis width={200} type="category" dataKey={"name"} label={{ value: 'Divisions',  position: 'left',  angle: -90 }} /> 
                    <Legend  wrapperStyle={{ marginTop: '10px' }} verticalAlign="top" height={36}/> 
                    <Tooltip />
                    <Bar dataKey={"focalCount"} name={"Number of Focals"}  fill="green" fillOpacity={0.8} />
                </BarChart>
            </ResponsiveContainer>
            <Title level={5} className="mt-4 text-center">No. of Members By Unit</Title>
            <ResponsiveContainer width={"100%"} height={500} >
                <BarChart layout="vertical" data={data.unitChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                    <CartesianGrid />
                    <XAxis  name="Focal Count" type="number" dataKey={"focalCount"} label={{ value: 'Focal Count', position: 'center', offset: 0, dy: 15   }}  /> 
                    <YAxis width={200} type="category" dataKey={"name"} label={{ value: 'Units',angle: -90, dy: -10, position: "left" }} /> 
                    <Legend  wrapperStyle={{ marginTop: '10px' }} verticalAlign="top" height={36}/> 
                    <Tooltip />
                    <Bar dataKey={"focalCount"} name={"Number of Focals"}  fill="green" fillOpacity={0.8} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

const Index = () => {
    return (
    <>
        <Layout>
            <Layout.Content style={{ padding: '0 0px' }}>
                <div className="site-layout-content">
                    <Time />
                    <div className="flex flex-col md:flex-row items-center md:items-start p-6 bg-lime-700 rounded mb-4 shadow-lg">
                        <img src={penro} alt="Penro" className="w-20 h-20 rounded-full md:mr-4" />
                        <div className="md:mt-0 mt-4 ">
                            <Title level={1} className="!text-white">ADMIN MANAGEMENT</Title>
                            <p className="text-white text-center md:text-left">Welcome to the Admin Management page. This page is designed for authorized personnel to manage users, programs, and reports configuration.</p>
                        </div>
                    </div>

                    <Title level={4}>Features</Title>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={12} md={8}>
                            <Card title="User Management" bordered={false} style={{ height: '220px' }}>
                                Manage users, including adding, editing, or deleting users, and assigning them roles.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Program Management" bordered={false} style={{ height: '220px' }}>
                                Manage programs, including adding, editing, or deleting programs, and assigning them to users.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Reports Configuration" bordered={false} style={{ height: '220px' }}>
                                Configure reports, including adding, editing, or deleting reports, and assigning them to programs.
                            </Card>
                        </Col>
                    </Row>
                </div>

                <Title level={4}>Overview</Title>
                <RenderChart1 />


            </Layout.Content>
        </Layout>
        
    </>
    )
}

export default Index;