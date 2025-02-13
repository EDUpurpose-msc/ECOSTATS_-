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

const formName = FormEnum.BIODIVERSITY_32;
const sector = Sector.BIODIVERSITY;

const Biodiversity_32_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData([])
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
                Marine Turtles Tagged and Released <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <div className="ag-theme-alpine mt-5" style={{ width: '100%', height: '500px' }}>
                    <AgGridReact 
                    rowData={data} 
                    columnDefs={
                        _.filter(biodiversity_32_col_defs, a => {
                            return ["province", "municipality", "date_encountered", "tag_no", "tagging", "date_released", "species"].includes(a.field!) || a.headerName == "Species"
                        })
                    } 
                    onGridReady={(ev) => ev.api.sizeColumnsToFit()}/>
                </div>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Biodiversity_32_Dashboard;