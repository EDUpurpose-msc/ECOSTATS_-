import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.BIODIVERSITY_17;
const sector = Sector.BIODIVERSITY;

const Biodiversity_17_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData([
                {
                    Province : "Marinduque",
                    Amphibians : _.sum(data.filter(a => a.taxonomic_group == "Amphibians").map(a => a.number_of_permits_issued)),
                    Mammals : _.sum(data.filter(a => a.taxonomic_group == "Mammals").map(a => a.number_of_permits_issued)),
                    Birds : _.sum(data.filter(a => a.taxonomic_group == "Birds").map(a => a.number_of_permits_issued)),
                    Invertebrates : _.sum(data.filter(a => a.taxonomic_group == "Invertebrates").map(a => a.number_of_permits_issued)),
                    Plants : _.sum(data.filter(a => a.taxonomic_group == "Plants").map(a => a.number_of_permits_issued)),
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
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Wildlife Collector's Permit (WCP) CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={400} >
                    <BarChart
                    layout="vertical"
                    data={chartData}>
                        <CartesianGrid />
                        <XAxis height={100} label="Number of Permits Issued" type="number" />
                        <YAxis width={100} type="category" dataKey="Province" />
                        <Tooltip  />
                        <Bar dataKey="Amphibians" stackId="a" fill="green" />
                        <Bar dataKey="Mammals" stackId="a" fill="RebeccaPurple" />
                        <Bar dataKey="Birds" stackId="a" fill="Crimson" />
                        <Bar dataKey="Invertebrates" stackId="a" fill="HotPink" />
                        <Bar dataKey="Plants" stackId="a" fill="Orange" />
                        <Legend  />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Biodiversity_17_Dashboard;