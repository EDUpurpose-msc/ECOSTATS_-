import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid, LineChart, Line } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.BIODIVERSITY_29;
const sector = Sector.BIODIVERSITY;

const Biodiversity_29_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData([
                {
                    Month : "Jan",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 1
                    }).map(a => a.quantity))
                },
                {
                    Month : "Feb",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 2
                    }).map(a => a.quantity))
                },
                {
                    Month : "March",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 3
                    }).map(a => a.quantity))
                },
                {
                    Month : "April",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 4
                    }).map(a => a.quantity))
                },
                {
                    Month : "May",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 5
                    }).map(a => a.quantity))
                },
                {
                    Month : "June",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 6
                    }).map(a => a.quantity))
                },
                {
                    Month : "July",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 7
                    }).map(a => a.quantity))
                },
                {
                    Month : "Aug",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 8
                    }).map(a => a.quantity))
                },
                {
                    Month : "Sept",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 9
                    }).map(a => a.quantity))
                },
                {
                    Month : "Oct",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 10
                    }).map(a => a.quantity))
                },
                {
                    Month : "Nov",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 11
                    }).map(a => a.quantity))
                },
                {
                    Month : "Dec",
                    Quantity : _.sum(data.filter(a => {
                        const date = new Date(a.date);
                        return date.getMonth() == 12
                    }).map(a => a.quantity))
                },
            ]
            )
            console.log(chartData)
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            date: {
                $gte: new Date(year, 0, 1), // Start of the year
                $lt: new Date(year + 1, 0, 1) // Start of the next year
            }
        })
        .then(res => {
            setData(res.data);
            console.log(res.data)
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
            Wild Flora Retrieval and Donation CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <LineChart
                        // layout="vertical"
                        data={chartData}>
                            <CartesianGrid />
                            <YAxis height={100}  type="number" />
                            <XAxis width={200} type="category" dataKey="Month" />
                            <Tooltip  />
                            <Line dataKey="Quantity" />
                            <Legend  />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Biodiversity_29_Dashboard;