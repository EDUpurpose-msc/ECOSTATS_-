import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, PieChart, Pie, Cell, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from 'numeral';

const formName = FormEnum.FORESTRY_3;
const sector = Sector.FORESTRY;

const Forestry_3_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
           
            setChartData(data.map(d => {
                return {
                    Municipality : d.municipality,
                    "Protection Forest" : d.protection_forest,
                    "Production Forest" : d.production_forest,
                }
            }));
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
                Production and Protection Forest (Hectares) CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={400}>

                    <BarChart 
                    data={chartData}
                    layout="vertical">
                        <CartesianGrid />
                        <XAxis type="number"  />
                        <YAxis width={100} type="category" dataKey="Municipality" />
                        <Tooltip formatter={value => numeral(value).format('0,0.00')} />
                        <Legend />
                        <LabelList dataKey="Name" color="red" />
                        <Bar dataKey="Production Forest" stackId="a" fill="green"  />
                        <Bar dataKey="Protection Forest" stackId="a" fill="lightgreen" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Forestry_3_Dashboard;