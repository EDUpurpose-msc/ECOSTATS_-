import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.BIODIVERSITY_2;
const sector = Sector.BIODIVERSITY;



const Biodiversity_2_Dashboard = () => {
    const colors = ["green", "lightgreen", "MediumSpringGreen"]
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            
            setChartData(_.uniqBy(data, "province").map(a => {
                return _.uniqBy(data, "coastal_resource").map((b,i) => {
                    return {
                        "Province" : a.province,
                        "Resource" : b.coastal_resource,
                        "Total Area" : _.sum(data.filter(c => c.province == a.province && c.coastal_resource == b.coastal_resource).map(d => d.area)),
                        color : colors[i]
                    }
                })
            }))
            console.log(chartData)
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            calendar_year : year
        })
        .then(res => {
            setData(res.data);
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Issued Chainsaw Registration CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                {
                    chartData.map((d,i) => {
                        return (
                            <div key={i}>
                                <p className="text-center mb-4">Total Percentage of Area Distribution (in hectares) of Coastal Resources in {d[0].Province}</p>
                                <ResponsiveContainer width="100%" height={400} className="mb-12">
                                    <PieChart className="mx-auto" >
                                        <Pie
                                        data={d}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={150}
                                        label={({value, percent}) => `${numeral(value).format("0,0.00")} - ${numeral(percent  * 100).format("0,0.00")}%`}
                                        dataKey="Total Area">
                                            {d.map((entry, index) => (
                                                <Cell key={entry} fill={entry.color} ></Cell>
                                            ))}
                                        </Pie>
                                        <Tooltip label formatter={(value, name, payload) => `${payload.payload.Resource} : ${numeral(value).format("0,0.00")}`} />
                                        <Legend formatter={(value, entry:any) => entry.payload!.Resource!}  />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )   
                    })
                }
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Biodiversity_2_Dashboard;