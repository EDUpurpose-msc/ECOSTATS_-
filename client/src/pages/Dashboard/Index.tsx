import { Card, Col, Layout, message, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import penro from "../../../public/penro.jpg";
import Time from "../../components/Time";
import { Bar, BarChart, CartesianAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { generateYearOptions } from "../../services/helper";
import { getSectorChartCountsData, getSectorTopReportsByChartCount } from "../../services/api/sectorApi";
import { useAsyncError } from "react-router-dom";
import { parseResError } from "../../services/errorHandler";

const truncateLabel = (label, maxLength) => {
    if (label.length > maxLength) {
        return `${label.substring(0, maxLength)}...`;
    }
    return label;
};

const RenderChart1 = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState([]);

    const init = async () => {
        try {
            const res = await getSectorChartCountsData(year);
            setData(res.data);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {  
        init();
    }, [year]);

    return (
        <Card className="mb-4" title="Data Visualization by Sector" bordered={false}>
            <div style={{ textAlign: 'right' }}>
                <Select placeholder="Select Year" className="w-20" value={year} onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </div>
            <ResponsiveContainer width={"100%"} height={300} >
                <BarChart layout="horizontal" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                    <CartesianGrid />
                    <YAxis name="Count" type="number" dataKey={"chartCount"} label={{ value: 'Count',  angle: -90, dy: -10 }}  /> 
                    <XAxis type="category" dataKey={"sector_name"} label={{ value: 'Sectors',  position: 'center', offset: 0, dy: 10 }} /> 
                    <Legend  wrapperStyle={{ marginTop: '10px' }} verticalAlign="top" height={36}/> 
                    <Tooltip />
                    <Bar dataKey={"chartCount"} name={"Chart Count"}  fill="green" fillOpacity={0.8} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

const RenderChart2 = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState([]);

    const init = async () => {
        try {
            const res = await getSectorTopReportsByChartCount(year);
            setData(res.data);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {  
        init();
    }, [year]);

    return (
        <Card className="mb-4" title="Top Reports by Chart Count" bordered={false}>
            <div style={{ textAlign: 'right' }}>
                <Select placeholder="Select Year" className="w-20" value={year} onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </div>
            <ResponsiveContainer width={"100%"} height={300} >
                <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                    <CartesianGrid />
                    <XAxis name="Count" type="number" dataKey={"chartCount"} label={{ value: 'Count', position: 'center', offset: 0, dy: 10 }}  /> 
                    <YAxis width={150} type="category" dataKey={"name"} tickFormatter={(label) => truncateLabel(label, 15)} label={{ value: 'Reports' ,position:"left",  angle: -90, dy: -10 }} /> 
                    <Legend wrapperStyle={{ marginTop: '10px' }} verticalAlign="top" height={36}/> 
                    <Tooltip />
                    <Bar dataKey={"chartCount"} name={"Chart Count"}  fill="green" fillOpacity={0.8} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

const DashboardIndex = () => {
    return (
    <>
        <Layout>
            <Layout.Content style={{ padding: '0 0px' }}>
                <div className="site-layout-content">
                    <Time />
                    <div className="flex flex-col md:flex-row items-center md:items-start p-6 bg-lime-700 rounded mb-4 shadow-lg">
                        <img src={penro} alt="Penro" className="w-20 h-20 rounded-full md:mr-4" />
                        <div className="md:mt-0 mt-4 ">
                            <Title level={1} className="!text-white">VISUALIZATIONS</Title>
                            <p className="text-white text-center md:text-left">A collection of dashboards showcasing data from various sources, from different PENRO Programs.</p>
                        </div>
                    </div>

                    <Title level={4}>Features</Title>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Charts Rendering" bordered={false} style={{ height: '220px' }}>
                                Render charts based on data from various sources.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Data Visualization" bordered={false} style={{ height: '220px' }}>
                                Visualize data in a way that helps users understand and make decisions.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Customizable Dashboards" bordered={false} style={{ height: '220px' }}>
                                Allow users to customize their own dashboards with the charts and data they need.
                            </Card>
                        </Col>
                    </Row>

                    <Title level={4}>Overview</Title>
                    <RenderChart1 />
                    <RenderChart2 />
                </div>
            </Layout.Content>
        </Layout>
        
    </>
    )
}

export default DashboardIndex;