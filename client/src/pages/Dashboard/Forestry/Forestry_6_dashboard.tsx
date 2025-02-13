import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.FORESTRY_6;
const sector = Sector.FORESTRY;

const Forestry_6_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData([
                {
                    Gender : "Male",
                    "No. of Beneficiaries" : _.sum(data.map(a => a.beneficiaries.male)),
                },
                {
                    Gender : "Female",
                    "No. of Beneficiaries" : _.sum(data.map(a => a.beneficiaries.female)),
                }
            ])
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
            Existing Community-Based Forest Management Agreement  CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>

                <Card>
                    <p className="text-center mb-4">Existing Community-Based Forest Management Agreement by Sex</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                        data={chartData}
                        layout="vertical"
                        barCategoryGap="10%">
                            <CartesianGrid />
                            <XAxis  type="number"  />
                            <YAxis width={100} type="category" dataKey="Gender" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="No. of Beneficiaries" stackId="a" fill="green"> 
                                <LabelList  
                                dataKey="No. of Beneficiaries" 
                                position="bottom" 
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

export default Forestry_6_Dashboard;