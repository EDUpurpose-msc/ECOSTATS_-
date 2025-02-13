import { Result, Select } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, BarChart, ResponsiveContainer, XAxis, YAxis, Bar, LabelList, Tooltip, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";

const formName = FormEnum.LAND_5;
const sector = Sector.LAND;

const Land_5_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(data.map(d => {
                return {
                    Municipality : d.municipality,
                    Male : d.male_beneficiaries,
                    Female : d.female_beneficiaries,
                    Total : d.female_beneficiaries + d.male_beneficiaries
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
            console.log(res.data)
        })
    }, [year]);


    return (
        <div>
            <Title className="text-center" level={5}>
                Homestead CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart className="mx-auto" data={chartData} layout="vertical" title="Total Number of RFPA beneficiaries">
                        <CartesianGrid />
                        <XAxis type="number" />
                        <YAxis width={100}  type="category" dataKey="Municipality" />
                        <Tooltip />
                        <Legend />
                        <LabelList />
                        <Bar dataKey="Male" stackId="a" fill="green" />
                        <Bar dataKey="Female" stackId="a" fill="lightgreen" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Land_5_Dashboard;