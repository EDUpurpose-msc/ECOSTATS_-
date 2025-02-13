import { Result, Select } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import { PieChart, Pie, Tooltip, Cell, LabelList, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { colorSchemeDark } from "ag-grid-community";
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash"

const formName = FormEnum.LAND_1;
const sector = Sector.LAND;

const Land_1_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(data.map(d => {
                return {
                    "Municipality" : d.municipality,
                    "Contested Area" : d.contested_area,
                    "Uncontested Area" : d.uncontested_area
                }
            }))
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            province : "Marinduque",
            calendar_year : year
        })
        .then(res => {
            setData(res.data);
            console.log(res.data)
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Marinduque Land Area CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                    data={chartData}
                    layout="vertical">
                        <XAxis type="number" />
                        <YAxis width={100} type="category" dataKey="Municipality" />
                        <Tooltip/>
                        <Bar dataKey="Contested Area" stackId="a" fill="green" >
                            <LabelList position="bottom" />
                        </Bar>
                        <Bar dataKey="Uncontested Area" stackId="a" fill="lightgreen" >
                            <LabelList position="bottom" />
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

export default Land_1_Dashboard;