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

const formName = FormEnum.BIODIVERSITY_12;
const sector = Sector.BIODIVERSITY;

const Biodiversity_12_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData([
                {
                    Province : "Marinduque",
                    "Number of Permits Issued" : {
                        WIC : _.sum(data.filter(a => a.permit_type == "WIC").map(a => a.number_of_permits_issued)),
                        WEC : _.sum(data.filter(a => a.permit_type == "WEC").map(a => a.number_of_permits_issued)),
                        WREC : _.sum(data.filter(a => a.permit_type == "WREC").map(a => a.number_of_permits_issued)),
                    },
                    "Revenue in Pesos" : {
                        WIC : _.sum(data.filter(a => a.permit_type == "WIC").map(a => a.revenue_generated)),
                        WEC : _.sum(data.filter(a => a.permit_type == "WEC").map(a => a.revenue_generated)),
                        WREC : _.sum(data.filter(a => a.permit_type == "WREC").map(a => a.revenue_generated)),
                    },
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
            Wildlife Import/Export/Re-Export Permit CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <CartesianGrid />
                            <XAxis height={100} label="Number of Permits Issued" type="number" />
                            <YAxis width={100} type="category" dataKey="Province" />
                            <Tooltip  />
                            <Bar name="WIC" dataKey="Number of Permits Issued.WIC" fill="green" />
                            <Bar name="WEC" dataKey="Number of Permits Issued.WEC" fill="lightgreen" />
                            <Bar name="WREC" dataKey="Number of Permits Issued.WREC" fill="SpringGreen" />
                            <Legend layout="vertical" align="left" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <br /><br />
                <Card>
                    <ResponsiveContainer width="100%" height={400} >
                        <BarChart
                        layout="vertical"
                        data={chartData}>
                            <CartesianGrid />
                            <XAxis height={100} label="Revenue in Pesos" type="number" />
                            <YAxis width={100} type="category" dataKey="Province" />
                            <Tooltip />
                            <Bar name="WIC" dataKey="Revenue in Pesos.WIC" fill="green" />
                            <Bar name="WEC" dataKey="Revenue in Pesos.WEC" fill="lightgreen" />
                            <Bar name="WREC" dataKey="Revenue in Pesos.WREC" fill="SpringGreen" />
                            <Legend layout="vertical" align="left" />
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

export default Biodiversity_12_Dashboard;