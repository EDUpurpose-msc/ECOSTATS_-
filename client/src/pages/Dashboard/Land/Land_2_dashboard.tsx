import { Result, Select } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import { PieChart, Pie, Tooltip, Cell, LabelList, Legend, BarChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import { colorSchemeDark } from "ag-grid-community";
import { ChatRounded } from "@mui/icons-material";
import { generateYearOptions } from "../../../services/helper";

const formName = FormEnum.LAND_2;
const sector = Sector.LAND;

const Land_2_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(data.map(d => {
                return {
                    Municipality : d.municipality,
                    "Total Income" : d.sale + d.lease
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
                Patrimonial Properties In Marinduque CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <ResponsiveContainer className={`${data.length == 0 && "hidden"}`} width="100%" height={500}>
                <BarChart layout="vertical" data={chartData}>
                    <CartesianGrid />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="Municipality" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Income" fill="green" />
                </BarChart>
            </ResponsiveContainer>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Land_2_Dashboard;