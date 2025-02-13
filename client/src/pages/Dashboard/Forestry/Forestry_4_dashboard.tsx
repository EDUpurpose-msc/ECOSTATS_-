import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.FORESTRY_4;
const sector = Sector.FORESTRY;

const Forestry_4_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData(
                _.uniqBy(data, "municipality").map(d => {
                    return {
                        Municipality : d.municipality,
                        "Total Reserve" : _.sum(_.filter(data, e => e.municipality == d.municipality).map(f => f.area_ha))
                    }
                })
            )
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
                Proclaimed Watershed Forest Reserve CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Flex gap={5} align="center" justify="center" className="mb-4">
                    <Card>
                        <Statistic title="Total Reserves" value={numeral(_.sum(_.map(data, d => d.area_ha))).format("0,0.00")} />
                    </Card>
                </Flex>
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
                        <Bar dataKey="Total Reserve" stackId="a" fill="green"> 
                            <LabelList  
                            dataKey="Total Reserve" 
                            position="bottom" 
                            formatter={value => numeral(value).format("0,0.00")} />
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

export default Forestry_4_Dashboard;