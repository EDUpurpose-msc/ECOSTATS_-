import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, BarChart, XAxis, YAxis, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";
import numeral from "numeral"

const formName = FormEnum.FORESTRY_5;
const sector = Sector.FORESTRY;

const Forestry_5_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData([])
            console.log(chartData)
        }
    }, [data]);

    useEffect(() => {
        formGetByQuery(formName, sector, {
            calendar_year : year
        })
        .then(res => {
            setData(res.data);
            console.log(data)
        })
    }, [year]);


    return <Result title="Not yet implemented" status="error" />
    // return (
    //     <div>
    //         <Title className="text-center" level={5}>
    //             Priority Critical Watershed Supporting National Irrigation System CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
    //         </Title>

    //         <div className={`${data.length == 0 && "hidden"} mx-auto`}>
    //             <Result title="Not yet implemented" status="error" />
    //         </div>

    //         {
    //             data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
    //         }
    //     </div>
    // )
}

export default Forestry_5_Dashboard;