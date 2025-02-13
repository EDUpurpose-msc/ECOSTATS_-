import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.FORESTRY_9;
const sector = Sector.FORESTRY;

const Forestry_9_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData(_.uniqBy(data, "municipality").map(a => {
                return {
                    "Municipality" : a.municipality,
                    "Area (ha)" : _.sum(data.filter(b => b.municipality == a.municipality).map(b => b.area))
                }
            }))
            console.log(chartData)
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            calendar_year : year,
            province : "Marinduque"
        })
        .then(res => {
            setData(res.data);
            console.log(data)
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
            Integrated Social Forestry (ISF) CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>

                <Card>
                    <p className="text-center mb-4">Land Area (in hectares) under Integrated Social Forestry (ISF)</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                        data={chartData}
                        layout="vertical"
                        barCategoryGap="10%">
                            <CartesianGrid />
                            <XAxis  type="number"  />
                            <YAxis width={100} type="category" dataKey="Municipality" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Area (ha)" stackId="a" fill="green" > 
                                <LabelList  
                                dataKey="Area (ha)" 
                                style={{ fill: '#fff', textShadow: '0 0 3px #000' }}
                                position="insideLeft"
                                formatter={value => numeral(value).format("0,0.00")} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Forestry_9_Dashboard;