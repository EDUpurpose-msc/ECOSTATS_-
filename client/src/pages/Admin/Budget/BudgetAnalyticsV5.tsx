import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { budgetGetByQuery } from "../../../services/api/budgetApi";
import { Card, Col, Flex, message, Result, Row, Statistic } from "antd";
import _ from "lodash";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const DecisionTree = require('decision-tree');

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
            console.log(res.data);
        } catch (error) {
            messageApi.error("Unexpected error occurred while initializing data");
        }
    };

    const predictBudgets = (year) => {
        setLoading(true);

        // Prepare the training data, where each entry is an object with features and a target (budget value)
        const trainingData = data.map((budget) => ({
            year: budget.calendar_year,
            landManpower: budget.land_manpower,
            biodiversityManpower: budget.biodiversity_manpower,
            forestryManpower: budget.forestry_manpower,
            land: budget.land,
            biodiversity: budget.biodiversity,
            forestry: budget.forestry
        }));
    
        // Define the target data for predictions (i.e., the budget values for each sector)
        const targetData = 'land'; // We will predict land budget first
    
        // Create and train the decision tree classifier for Land
        const classifier = new DecisionTree();
        ;

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

            <Flex>
                <Card  className="w-full" > 
                    <p className="text-center"></p>
                    <ResponsiveContainer height={500}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="category" dataKey="calendar_year" />
                            <YAxis type="number" />
                            <Line name="Total" dataKey="total" strokeWidth={4} />
                            <Line name="Land" dataKey="land" stroke="green" strokeWidth={2}/>
                            <Line name="Biodiversity" dataKey="biodiversity" stroke="lightgreen" strokeWidth={2} />
                            <Line name="Forestry" dataKey="forestry" stroke="springgreen" strokeWidth={2} />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Flex>
        </div>
    );
};

export default BudgetAnalytics;
