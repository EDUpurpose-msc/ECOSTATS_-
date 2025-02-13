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
import { biodiversity_9_col_defs } from "../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_9";
import { biodiversity_15_col_defs } from "../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_15";

const formName = FormEnum.BIODIVERSITY_15;
const sector = Sector.BIODIVERSITY;

const Biodiversity_15_Dashboard = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if(data[0]){
            setChartData(_.uniqBy(data, "taxonomic_group").map(a => {
                return {
                    province : "Marinduque",
                    municipality : data.filter(b => b.taxonomic_group == a.taxonomic_group).map(c => c.municipality).join(", "),
                    taxonomic_group : a.taxonomic_group,
                    number_of_permits_issued : _.sum(data.filter(b => b.taxonomic_group == a.taxonomic_group).map(c => c.number_of_permits_issued)),
                    revenue_generated : numeral(_.sum(data.filter(b => b.taxonomic_group == a.taxonomic_group).map(c => c.revenue_generated))).format("0,00.00")
                }
            }))
            console.log(data)
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
                Wildlife Collector's Permit (WCP) CY <Select value={year} className="mr-2" onChange={(y) => setYear(y)} options={[...generateYearOptions(2000, new Date().getFullYear())]} />
            </Title>

            <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                <div className="ag-theme-alpine mt-5" style={{ width: '100%', height: '500px' }}>
                    <AgGridReact 
                    rowData={chartData} 
                    defaultColDef={{
                        wrapText : true,
                        autoHeight : true
                    }}
                    columnDefs={biodiversity_15_col_defs.filter(a => {
                            return ["province", "municipality", "taxonomic_group", "number_of_permits_issued", "revenue_generated"].includes(a.field)
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

export default Biodiversity_15_Dashboard;