import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid, Area } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"
import { AgGridReact } from "ag-grid-react";
import { biodiversity_9_col_defs } from "../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_9";

const formName = FormEnum.BIODIVERSITY_11;
const sector = Sector.BIODIVERSITY;

const Biodiversity_11_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(data.map(a => {
                return {
                    Municipality : a.municipality,
                    "Number of CWR Issued" : a.number_of_cwr_issued,
                    "Revenue Generated(Php)" : a.revenue_generated
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
            Certificate of Wildlife Registration CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <XAxis height={100} label="Number of CWR Issued" type="number" />
                            <YAxis width={100} type="category" dataKey="Municipality" />
                            <Tooltip />
                            <Bar dataKey="Number of CWR Issued" fill="green" />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <br /><br />
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <XAxis height={100} label="Revenue Generated(Php)" type="number" />
                            <YAxis width={100} type="category" dataKey="Municipality" />
                            <Tooltip />
                            <Bar dataKey="Revenue Generated(Php)" fill="green" />
                            <Legend />
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

export default Biodiversity_11_Dashboard;