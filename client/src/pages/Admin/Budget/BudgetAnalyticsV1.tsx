import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { budgetGetByQuery } from "../../../services/api/budgetApi";
import { Card, Col, Flex, message, Result, Row, Statistic } from "antd";
import * as tf from "@tensorflow/tfjs";
import _ from "lodash";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

 

 const BudgetAnalytics = () => {
    
    const [messageApi, contextHandler] = message.useMessage();
    const [data, setData] = useState<any>([]);
    const currentYear = new Date().getFullYear();
    const [loading, setLoading] = useState<boolean>(false);
    const [tensors, setTensors] = useState<any>({
        yearTensor : null,
        landTensor : null,
        biodiversityTensor : null,
        forestryTensor : null
    });

    const [predictedBudget, setPredictedBudget] = useState<any>({
        calendar_year : null,
        land : null,
        biodiversity : null,
        forestry : null,
        total : null,
    })

    const fetchData = async () => {
        try {
            const res = await budgetGetByQuery({});
            setData(_.sortBy(res.data, ["calendar_year"]));
            
        } catch (error) {
            messageApi.error("Unexpected Error occured while initializing data")
        }
    }

    const normalize = data => data.map(val => val / Math.max(...data));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    // Train model for each category separately
    async function trainAndPredict(tensorX, tensorY, yearToPredict, budgetArray) {
        await model.fit(tensorX, tensorY, { epochs: 500 })

        const normalizedYear = yearToPredict / Math.max(...data.map(a => a.calendar_year));

        const normalizedPrediction = model.predict(tf.tensor2d([[normalizedYear]]));

        const singlePrediction = Array.isArray(normalizedPrediction) ? normalizedPrediction[0] : normalizedPrediction;
        return singlePrediction.mul(Math.max(...budgetArray)).dataSync()[0];
    }

    const predictBudgets = async (year) => {
        setLoading(true)
        const landPrediction = await trainAndPredict(tensors.yearTensor, tensors.landTensor, year, data.map(a => a.land));
        const biodiversityPrediction = await trainAndPredict(tensors.yearTensor, tensors.biodiversityTensor, year, data.map(a => a.biodiversity));
        const forestryPrediction = await trainAndPredict(tensors.yearTensor, tensors.forestryTensor, year, data.map(a => a.forestry));
        const total = _.sum([landPrediction, biodiversityPrediction, forestryPrediction]);

        setPredictedBudget({
            calendar_year : year,
            land : landPrediction,
            biodiversity : biodiversityPrediction,
            forestry : forestryPrediction,
            total : total,
        });
        console.log(predictedBudget)
        setLoading(false)
    }

    const RenderCurrentBudget = () => {
        const budget = data.filter(a => a.calendar_year == currentYear)[0];
        if(budget){
            return (
                <Row gutter={[16, 16]} className="sm:gutter-row">
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card className="h-full">
                            <Statistic className="text-green-500" value={budget.total}  title="Total Budget" precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card className="h-full">
                            <Statistic value={budget.land}  title="Land Sector" precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card className="h-full">
                            <Statistic value={budget.forestry}  title="Forestry Sector" precision={0} prefix="₱" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card className="h-full">
                            <Statistic value={budget.biodiversity}  title="Biodiversity Sector" precision={0} prefix="₱" />
                        </Card>
                    </Col>
                </Row>
            )
        }
        else{
            return <Result status="error" subTitle="Can't find the budget for the current year"  />
        }
    }

    const RenderPredictedBudget = () => {
        const budget = data.filter(a => a.calendar_year == currentYear)[0];
        if(budget){
            return (
                <Row gutter={[16, 16]} className="sm:gutter-row">
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card loading={loading} className="h-full">
                            <Statistic 
                            value={predictedBudget.total}  
                            title="Total Budget" 
                            precision={0} 
                            prefix={budget && predictedBudget.total > budget.total ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" /> } 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card  loading={loading} className="h-full">
                            <Statistic value={predictedBudget.land}  
                            title="Land Sector" 
                            precision={0} 
                            prefix={budget && predictedBudget.land > budget.land ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" /> } 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card  loading={loading} className="h-full">
                            <Statistic value={predictedBudget.forestry}  
                            title="Forestry Sector" 
                            precision={0} 
                            prefix={budget && predictedBudget.forestry > budget.forestry ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" /> } 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className="sm:mb-0 mb-4">
                        <Card  loading={loading} className="h-full">
                            <Statistic 
                            value={predictedBudget.biodiversity}  
                            title="Biodiversity Sector" 
                            precision={0} 
                            prefix={budget && predictedBudget.biodiversity > budget.biodiversity ? <ArrowUpOutlined className="text-green-500" /> : <ArrowDownOutlined className="text-red-500" /> } 
                            />
                        
                        </Card>
                    </Col>
                </Row>
            )
        }
        else{
            return <Result status="error" subTitle="Can't find the budget for the current year"  />
        }
    }

    useEffect(() => {
        if(!tensors.yearTensor || !tensors.landTensor || !tensors.biodiversityTensor || !tensors.forestryTensor )
            return 

        predictBudgets(new Date().getFullYear());

        console.log("Data:", data);
        console.log("Tensors:", tensors);

    }, [tensors])


    useEffect(() => {
        if(data == null || data.length == 0)
            return
        setTensors({
            yearTensor : tf.tensor2d(normalize(data.map(a => a.calendar_year)), [data.length, 1]),
            landTensor : tf.tensor2d(normalize(data.map(a => a.land)), [data.length, 1]),
            biodiversityTensor : tf.tensor2d(normalize(data.map(a => a.biodiversity)), [data.length, 1]),
            forestryTensor : tf.tensor2d(normalize(data.map(a => a.forestry)), [data.length, 1])
        });

        return () => {
            tensors.yearTensor?.dispose();
            tensors.landTensor?.dispose();
            tensors.biodiversityTensor?.dispose();
            tensors.forestryTensor?.dispose();
        };
    }, [data])

    useEffect(() => {
        fetchData();
    }, [currentYear]);

    return (
        <div>
            { contextHandler }
            <Title level={4}>Budget Analytics</Title>

            <Flex className="mb-4" gap={10} justify="center" align="center" >
                <Title level={2}>Forcasted Budget for {new Date().getFullYear() + 1}</Title>
                { RenderPredictedBudget() }
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
    )
 }

 export default BudgetAnalytics;