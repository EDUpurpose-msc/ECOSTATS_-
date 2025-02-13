import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.BIODIVERSITY_3;
const sector = Sector.BIODIVERSITY;



const Biodiversity_3_Dashboard = () => {
    const colors = ["green", "lightgreen", "MediumSpringGreen"]
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            
            setChartData(_.uniqBy(data, "municipality").map(a => {
                return {
                    Municipality : a.municipality,
                    "Area assessed (ha)" : _.sum(data.filter(b => b.municipality == a.municipality).map(c => c.area_assessed))
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
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Inventory of Coral Reef <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                    layout="vertical"
                    data={chartData}>
                        <YAxis width={100} type="category" dataKey="Municipality" />
                        <XAxis type="number" />
                        <Tooltip />
                        <Bar dataKey="Area assessed (ha)" fill="green" >
                            {/* <LabelList position="bottom" /> */}
                        </Bar>
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Biodiversity_3_Dashboard;