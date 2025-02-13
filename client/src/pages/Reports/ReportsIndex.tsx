import { Card, Col, Layout, message, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import penro from "../../../public/penro.jpg";
import Time from "../../components/Time";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateYearOptions } from "../../services/helper";
import { useEffect, useState } from "react";
import { parseResError } from "../../services/errorHandler";
import { getReportOverviewData } from "../../services/api/sectorApi";


export const RenderReportOverview = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any>({});

    const init = async () => {
        try {
            const res = await getReportOverviewData(year);  
            setData(res.data);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        init(); 
    }, [year]);

    return (
      <Card
        className="w-full"
        title="Reports"
      >
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

        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Card >
              <Title level={4}>Total Reports Configured</Title>
              <p>{data.totalForms}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card >
              <Title level={4}>Pending Reports</Title>
              <p>{data.pendingReports}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card >
              <Title level={4}>Approved Reports</Title>
              <p>{data.approvedReports}</p>
            </Card>
          </Col>
        </Row>
        
        <Title className="text-center" level={5}>Reports by Sector</Title>
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
                <Bar fillOpacity={0.8} dataKey="report_count" name={"Count"}  fill="green" />
            </BarChart>
        </ResponsiveContainer>
        
        
      </Card>
    )
}
const ReportsIndex = () => {
    return (
    <>
        <Layout>
            <Layout.Content style={{ padding: '0 0px' }}>
                <div className="site-layout-content">

                    <Time />
                    <div className="flex flex-col md:flex-row items-center md:items-start p-6 bg-lime-700 rounded mb-4 shadow-lg">
                        <img src={penro} alt="Penro" className="w-20 h-20 rounded-full md:mr-4" />
                        <div className="md:mt-0 mt-4 ">
                            <Title level={1} className="!text-white">REPORTS MANAGEMENT</Title>
                            <p className="text-white text-center md:text-left">The Reports Management page allows you to manage and customize reports, including migrating data from existing forms to new forms, customizing the layout and fields of reports, and managing reports.</p>
                        </div>
                    </div>

                    <Title level={4}>Features</Title>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Data Migration" bordered={false} style={{ height: '220px' }}>
                                Migrate data from existing forms to new forms, including mapping fields and values.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Customize Reports" bordered={false} style={{ height: '220px' }}>
                                Customize the layout and fields of the reports, including adding, editing, or deleting fields.
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card title="Manage Reports" bordered={false} style={{ height: '220px' }}>
                                Manage reports, including adding, editing, or deleting reports, and assigning them to users or programs.
                            </Card>
                        </Col>
                    </Row>

                    <Title level={4}>Overview</Title>
                    <RenderReportOverview />
                    
                </div>
            </Layout.Content>
        </Layout>
        
    </>
    )
}

export default ReportsIndex;