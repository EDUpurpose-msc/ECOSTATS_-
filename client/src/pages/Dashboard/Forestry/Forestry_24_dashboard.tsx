import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.FORESTRY_24;
const sector = Sector.FORESTRY;

const Forestry_24_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            // setChartData([
            //     {
            //         Municipality : "Chansaw Registration",
            //         "Total No. of Chainsaw Operators" : 23,
            //         "Total No. of Chainsaw Registered" : 20
            //     }
            // ])
            setChartData(_.uniqBy(data, "municipality").map(a => {
                return {
                    Municipality : a.municipality,
                    "Total No. of Chainsaw Operators" : _.sum(data.filter(b => b.municipality == a.municipality).map(a => a.number_of_chainsaw_operator)),
                    "Total No. of Chainsaw Registered" : _.sum(data.filter(b => b.municipality == a.municipality).map(a => a.number_of_chainsaw_registered))
                }
            }))
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
                Issued Chainsaw Registration CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                    data={chartData}
                    layout="vertical"
                    >   
                        <CartesianGrid />
                        <XAxis type="number" /> 
                        <YAxis width={100} type="category" dataKey="Municipality" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Total No. of Chainsaw Operators" fill="green">
                            {/* <LabelList position="bottom" /> */}
                        </Bar>
                        <Bar dataKey="Total No. of Chainsaw Registered" fill="lightgreen">
                            {/* <LabelList position="bottom"/> */}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Forestry_24_Dashboard;