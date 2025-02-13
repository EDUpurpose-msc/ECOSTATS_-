import { Card, Flex, Result, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react";
import { formGetByQuery } from "../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../types/forms/formNameEnum";
import {  Legend, LabelList, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { generateYearOptions } from "../../../services/helper";
import _ from "lodash";

const formName = FormEnum.FORESTRY_2;
const sector = Sector.FORESTRY;

const Forestry_2_Dashboard = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            console.log(data)
            setChartData([
                {
                    Name : "Forest Cover",
                    Total : _.sum(
                        _.map(data, d => {
                            return _.sum([
                                d.forest_cover.closed_forest,
                                d.forest_cover.mangrove_forest,
                                d.forest_cover.open_forest,
                            ])
                        })
                    ),
                    color: "green"
                },
                {
                    Name : "Other Land Cover",
                    Total : _.sum(
                        _.map(data, d => {
                            return _.sum([
                                d.other_land_cover.annual_crop,
                                d.other_land_cover.brush_shrubs,
                                d.other_land_cover.built_up_area,
                                d.other_land_cover.fishpond,
                                d.other_land_cover.grassland,
                                d.other_land_cover.inland_water,
                                d.other_land_cover.marshland_swamp,
                                d.other_land_cover.open_barren_land,
                                d.other_land_cover.perennial_crop,
                            ])
                        })
                    ),
                    color : "#63f763"
                }
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
                <Flex gap={5} align="center" justify="center" >
                    {
                        chartData.map(d => {
                            return (
                                <Card>
                                    <Statistic title={d.Name} value={d.Total} />
                                </Card>
                            )
                        })
                    }
                    
                </Flex>
                <PieChart className="mx-auto" width={400} height={400} style={{ outline: 'none' }} >
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    dataKey="Total"
                    nameKey="Name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {chartData.map((entry) => (
                            <Cell key={`${entry.Name}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <LabelList dataKey="Total" position="outside" />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </div>

            {
                data.length == 0 && <Result status={404} subTitle="Can't initialize the chart, try double checking the data." />
            }
        </div>
    )
}

export default Forestry_2_Dashboard;