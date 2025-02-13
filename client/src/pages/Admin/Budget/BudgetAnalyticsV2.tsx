import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { budgetGetByQuery } from "../../../services/api/budgetApi";
import { Card, Col, Flex, message, Result, Row, Statistic } from "antd";
import _ from "lodash";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const BudgetAnalytics = () => {
    const [messageApi, contextHandler] = message.useMessage();
    const [data, setData] = useState<any>([]);
    const currentYear = new Date().getFullYear();
    const [loading, setLoading] = useState<boolean>(false);

    const [predictedBudget, setPredictedBudget] = useState<any>({
        calendar_year: null,
        land: null,
        biodiversity: null,
        forestry: null,
        total: null,
    });

    const fetchData = async () => {
        try {
            const res = await budgetGetByQuery({});
            setData(_.sortBy(res.data, ["calendar_year"]));
        } catch (error) {
            messageApi.error("Unexpected error occurred while initializing data");
        }
    };

    const calculateLinearRegression = (x: number[], y: number[]) => {
        const n = x.length;
        const sumX = _.sum(x);
        const sumY = _.sum(y);
        const sumXY = _.sum(x.map((xi, i) => xi * y[i]));
        const sumX2 = _.sum(x.map(xi => xi * xi));

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    };

    const predictBudgets = (year: number) => {
        setLoading(true);
        const years = data.map(a => a.calendar_year);
        const land = data.map(a => a.land);
        const biodiversity = data.map(a => a.biodiversity);
        const forestry = data.map(a => a.forestry);

        const { slope: landSlope, intercept: landIntercept } = calculateLinearRegression(years, land);
        const { slope: biodiversitySlope, intercept: biodiversityIntercept } = calculateLinearRegression(years, biodiversity);
        const { slope: forestrySlope, intercept: forestryIntercept } = calculateLinearRegression(years, forestry);

        const landPrediction = landSlope * year + landIntercept;
        const biodiversityPrediction = biodiversitySlope * year + biodiversityIntercept;
        const forestryPrediction = forestrySlope * year + forestryIntercept;
        const total = landPrediction + biodiversityPrediction + forestryPrediction;

        setPredictedBudget({
            calendar_year: year,
            land: landPrediction,
            biodiversity: biodiversityPrediction,
            forestry: forestryPrediction,
            total,
        });

        setLoading(false);
    };

    const RenderCurrentBudget = () => {
        const budget = data.find(a => a.calendar_year === currentYear);
        if (budget) {
            return (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Total Budget" value={budget.total} precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Land Sector" value={budget.land} precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Forestry Sector" value={budget.forestry} precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Biodiversity Sector" value={budget.biodiversity} precision={0} prefix="₱" />
                        </Card>
                    </Col>
                </Row>
            );
        }
        return <Result status="error" subTitle="Can't find the budget for the current year" />;
    };

    const RenderPredictedBudget = () => {
        if (predictedBudget.calendar_year) {
            return (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card loading={loading}>
                            <Statistic 
                                title="Total Budget" 
                                value={predictedBudget.total} 
                                precision={0} 
                                prefix={predictedBudget.total > data[data.length - 1]?.total ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card loading={loading}>
                            <Statistic 
                                title="Land Sector" 
                                value={predictedBudget.land} 
                                precision={0} 
                                prefix={predictedBudget.land > data[data.length - 1]?.land ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card loading={loading}>
                            <Statistic 
                                title="Forestry Sector" 
                                value={predictedBudget.forestry} 
                                precision={0} 
                                prefix={predictedBudget.forestry > data[data.length - 1]?.forestry ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card loading={loading}>
                            <Statistic 
                                title="Biodiversity Sector" 
                                value={predictedBudget.biodiversity} 
                                precision={0} 
                                prefix={predictedBudget.biodiversity > data[data.length - 1]?.biodiversity ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" />} 
                            />
                        </Card>
                    </Col>
                </Row>
            );
        }
        return <Result status="error" subTitle="Prediction not available" />;
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length) {
            predictBudgets(currentYear + 1);
        }
    }, [data]);

    return (
        <div>
            {contextHandler}
            <Title level={4}>Budget Analytics</Title>
            <Flex className="mb-4" gap={10} justify="center" align="center">
                <Title level={2}>Forecasted Budget for {currentYear + 1}</Title>
                {RenderPredictedBudget()}
            </Flex>
            <Flex className="mb-4" gap={10} justify="center" align="center">
                <Title level={2}>Allocated Budget this {currentYear}</Title>
                {RenderCurrentBudget()}
            </Flex>
        </div>
    );
};

export default BudgetAnalytics;

const sampledata = [
    {
        "_id": "674c2b2d805afda704a7547d",
        "calendar_year": 2024,
        "land": 140000,
        "land_manpower" : 20,
        "biodiversity": 170600,
        "biodiversity_manpower": 29,
        "forestry": 160000,
        "forestry_manpower": 18,
        "total": 470600,
        "createdAt": "2024-12-01T09:23:57.988Z",
        "updatedAt": "2024-12-01T10:04:48.983Z",
        "__v": 0
    },
    {
        "_id": "674c2b70805afda704a75487",
        "calendar_year": 2023,
        "land": 140000,
        "land_manpower" : 21,
        "biodiversity": 160000,
        "biodiversity_manpower": 28,
        "forestry": 150000,
        "forestry_manpower": 21,
        "total": 450000,
        "createdAt": "2024-12-01T09:25:04.648Z",
        "updatedAt": "2024-12-01T09:25:04.648Z",
        "__v": 0
    },
    {
        "_id": "674c2b94805afda704a75491",
        "calendar_year": 2022,
        "land": 130000,
        "land_manpower" : 22,
        "biodiversity": 150000,
        "biodiversity_manpower": 27,
        "forestry": 140000,
        "forestry_manpower": 22,
        "total": 420000,
        "createdAt": "2024-12-01T09:25:40.291Z",
        "updatedAt": "2024-12-01T09:25:40.291Z",
        "__v": 0
    }
]
