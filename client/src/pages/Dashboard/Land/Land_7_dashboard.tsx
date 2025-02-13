import { Result, Select } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";

const formName = FormEnum.LAND_7;
const sector = Sector.LAND;

const Land_7_Dashboard = () => {

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
            calendar_year : year
        })
        .then(res => {
            setData(res.data);
        })
    }, [year]);


    return (
        // <div>
        //     <Title className="text-center" level={5}>
        //         List of Special Patent of LGUs and NGAs CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
        //     </Title>

        //     <div className={`${data.length == 0 && "hidden"} mx-auto`}>
        //         <PieChart className="mx-auto" width={400} height={400} style={{ outline: 'none' }} >
        //             <Pie
        //             data={chartData}
        //             cx="50%"
        //             cy="50%"
        //             labelLine={false}
        //             outerRadius={150}
        //             dataKey="Area"
        //             nameKey="Name"
        //             label>
        //                 {chartData.map((entry, index) => (
        //                     <Cell key={`${entry.Name}`} fill={entry.color} />
        //                 ))}
        //             </Pie>
        //             <Tooltip />
        //             <LabelList dataKey="Name" position="inside" />
        //             <Legend verticalAlign="bottom" height={36} />
        //         </PieChart>
        //     </div>

        //     {
        //         data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
        //     }
        // </div>
        <div   >
            <Result title="Not yet implemented" status="warning" />
        </div>
    )
}

export default Land_7_Dashboard;