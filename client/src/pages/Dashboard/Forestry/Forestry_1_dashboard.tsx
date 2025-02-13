import { Result, Select } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";

const formName = FormEnum.FORESTRY_1;
const sector = Sector.FORESTRY;

const Forestry_1_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData([
                {
                    Name : "Classified Area",
                    Total : _.sum(
                        _.map(data, d => {
                            return _.sum([
                                d.forestland.classified_forestland.civil_registration,
                                d.forestland.classified_forestland.established_forest_reserves,
                                d.forestland.classified_forestland.established_timberland,
                                d.forestland.classified_forestland.fishpond,
                                d.forestland.classified_forestland.military_and_naval_reservations,
                                d.forestland.classified_forestland.national_parks_and_grbs_wa,
                            ]);
                        })
                    ),
                    color : "green"
                },
                {
                    Name : "Unclassified Area",
                    Total : _.sum(
                        _.map(data, d => d.forestland.unclassified_forestland_ha)
                    ),
                    color : "#63f763"
                },
            ])
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
        <div>
            <Title className="text-center" level={5}>
                List of Special Patent of LGUs and NGAs CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <PieChart className="mx-auto" width={400} height={400} style={{ outline: 'none' }} >
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    dataKey="Total"
                    nameKey="Name"
                    label>
                        {chartData.map((entry, index) => (
                            <Cell key={`${entry.Name}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <LabelList dataKey="Name" position="inside" />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Forestry_1_Dashboard;