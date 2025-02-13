import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"
import { AgGridReact } from "ag-grid-react";
import { biodiversity_32_col_defs } from "../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_32";

const formName = FormEnum.BIODIVERSITY_33;
const sector = Sector.BIODIVERSITY;

const Biodiversity_33_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(data)
            console.log(chartData)
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            calendar_year : year,
        })
        .then(res => {
            setData(res.data);
            console.log(res.data)
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Marine Turtles Tagged and Released <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Card>
                    <p className="text-center mb-2">Number of Stranded Marine Turtle</p>
                    <ResponsiveContainer width="100%" height={600} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <CartesianGrid />
                            <XAxis height={100} type="number" />
                            <YAxis width={100} type="category" dataKey="species" />
                            <Tooltip  />
                            <Bar name="Released" dataKey="numbers.released" fill="green" stackId="a" />
                            <Bar name="Mortality" dataKey="numbers.mortality" fill="lightgreen" stackId="a" />
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

export default Biodiversity_33_Dashboard;