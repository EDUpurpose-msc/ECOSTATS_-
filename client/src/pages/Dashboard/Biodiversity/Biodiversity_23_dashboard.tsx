import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral";

const formName = FormEnum.BIODIVERSITY_23;
const sector = Sector.BIODIVERSITY;

const Biodiversity_23_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(_.uniqBy(data, "taxonomic_group").map(a => {
                return {
                    "Taxonomic Group" : a.taxonomic_group,
                    "Number of Species" : _.sum(data.filter(b => b.taxonomic_group == a.taxonomic_group).map(b => b.no_of_species))
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
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Known Flora Species by Taxonomic Group CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <CartesianGrid />
                            <XAxis height={100} label="Number of Species" type="number" />
                            <YAxis width={100} type="category" dataKey="Taxonomic Group" />
                            <Tooltip  />
                            <Bar dataKey="Number of Species" fill="green" />
                            <Legend  />
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

export default Biodiversity_23_Dashboard;