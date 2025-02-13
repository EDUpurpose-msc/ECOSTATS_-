import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reportConfigGetByQuery } from "../../services/api/reportConfigApi";
import { Button, Card, Col, Flex, message, Result, Row, Select, Typography } from "antd";
import { parseResError } from "../../services/errorHandler";
import Title from "antd/es/typography/Title";
import _ from "lodash"
import { flattenFields, generateColDefs, generateYearOptionsFixed, getRandomColor, getRandomColorByScheme } from "../../services/helper";
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianAxis, CartesianGrid } from "recharts";
import { ReloadOutlined } from "@ant-design/icons"
import { AgGridReact } from "ag-grid-react";
import { sectorGetByQuery } from "../../services/api/sectorApi";


const getFieldName = (fields: any[], identifier: string): string =>
    fields.find((f) => f.identifier === identifier)?.name || "";

const generateYearOptionsBySector = (sectors : any[]) => {
    return _.uniqBy(sectors, "calendar_year").map(s => ({label : s.calendar_year, value : s.calendar_year}));
}

const HorizontalBarChart = ({config, chart, data} : {config : any, chart : any, data : any[]}) => {

    const [chartData, setChartData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);


    useEffect(() => {
        if(data.length > 0 && fields.length > 0){
            chart.chart_config.x_axis.forEach((item : any) => {
                console.log(fields.filter(f => f.identifier == item)[0].name)
            });
            setChartData(
                 _.uniqBy(data, chart.chart_config.y_axis)
                 .map((d:any) => {
                     const _data =  {
                        [fields.filter(f => f.identifier == chart.chart_config.y_axis)[0].name] : d[chart.chart_config.y_axis],
                     }
                     chart.chart_config.x_axis.forEach((item : any) => {
                         _data[fields.filter(f => f.identifier == item)[0].name] = _.sum(data.filter(a => d[chart.chart_config.y_axis] == a[chart.chart_config.y_axis]).map(d => parseInt(d[item])));
                     });
                     return _data;
                 })
             );
        }
    }, [data, fields]);

    useEffect(() => {
        console.log(chartData)
    }, [chartData])

    useEffect(() => {
        if(config.fields.length > 0)
            setFields(flattenFields(config.fields));
    }, [config]);

    return (
        <Card className="w-full h-full">
            <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
            {
                chartData.length <= 0 && (
                    <Result status="error" title="No data available" />
                )
            }
            {
                (fields.length > 0 && data.length > 0) && (
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={chartData}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis type="category" dataKey={fields.filter(f => f.identifier == chart.chart_config.y_axis)[0]?.name} />
                            <XAxis type="number"  />
                            <Tooltip />
                            {
                                chart.chart_config.x_axis.map((item : any, index : number) => {
                                    if(chart.chart_config.stacked)
                                        return (
                                            <Bar fill={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)} stackId="a"  key={item} dataKey={fields.filter(f => f.identifier == item)[0].name}  />
                                        )
                                    else 
                                        return (
                                            <Bar fill={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)}  key={item} dataKey={fields.filter(f => f.identifier == item)[0]?.name}  />
                                        )
                                })
                            }
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                )
            }
        </Card>
    )
}

// const VerticalBarChart = ({config, chart, data, sectors} : {config : any, chart : any, data : any[], sectors : any[]}) => {

//     const [chartData, setChartData] = useState<any[]>([]);
//     const [filteredData, setFilteredData] = useState<any[]>([]);
//     const [fields, setFields] = useState<any[]>([]);
//     const [years, setYears] = useState<any[]>([]);
//     const [category, setCategory] = useState<string>("");
//     const [sectorIdentifier, setSectorIdentifier] = useState<any[]>([]);

//     const getDataByYears = async () => {
//         try {
//             const _data: any[] = []; 
//             for (const year of years) {
//                 // Use find instead of filter for a single result
//                 const sector = sectors.find(
//                     (s) => s.calendar_year === year && s.identifier === sectorIdentifier
//                 );
    
//                 if (!sector) {
//                     console.warn(`No sector found for year: ${year}`);
//                     continue; // Skip if no matching sector
//                 }
    
//                 // Fetch report config with associated data
//                 const _config = await reportConfigGetByQuery({ sector: sector._id, _id : config._id }, ["data"]);

//                 _data.push({
//                     Year: year,
//                     data: _config.data[0]?.data.map((d: any) => d.data),
//                 });
//             }

//             const _currentYear = config.sector.calendar_year;

//             const _chartData =  _.uniqBy(_data.filter(d => d.Year == _currentYear)[0].data, chart.chart_config.x_axis)
//             .map((d:any) => {
//                 const ret = {
//                     [fields.filter(f => f.identifier == chart.chart_config.x_axis)[0]?.name] : d[chart.chart_config.x_axis],
//                 }
//                 _data.forEach((item : any) => {
//                     let data = item.data;
//                     ret[item.Year] = _.sum(data.filter(d => d[chart.chart_config.x_axis] == ret[fields.filter(f => f.identifier == chart.chart_config.x_axis)[0]?.name]).map(d => parseInt(d[category] ?? 0)));
//                 });
//                 return ret;
//             });
//             setFilteredData(_chartData);
//         } catch (error) {
//             console.error("Failed to fetch data by years:", error);
//             message.error(parseResError(error).msg || "An unexpected error occurred.");
//         }
//     };
    

//     useEffect(() => {
//         if(years.length > 0 && category.length > 0)
//             getDataByYears();
//     }, [years, category, chart, config, data]);

//     useEffect(() => {
//         if(data.length > 0 && fields.length > 0){
//             setChartData(
//                  _.uniqBy(data, chart.chart_config.x_axis)
//                  .map((d:any) => {
//                      const _data =  {
//                         [fields.filter(f => f.identifier == chart.chart_config.x_axis)[0]?.name] : d[chart.chart_config.x_axis],
//                      }
//                      chart.chart_config.y_axis.forEach((item : any) => {
//                          _data[fields.filter(f => f.identifier == item)[0]?.name] = _.sum(data.filter(a => d[chart.chart_config.x_axis] == a[chart.chart_config.x_axis]).map(d => parseInt(d[item])));
//                      });
//                      return _data;
//                  })
//              );
//         }
//     }, [data, fields]);

//     useEffect(() => {
//         if(config.fields.length > 0){
//             setFields(flattenFields(config.fields));
//             setSectorIdentifier(config.sector.identifier);
//         }
//     }, [config]);

//     return (
//         <Card className="w-full h-full">
//             <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
//             {
//                 (chart.chart_config.include_other_years && chart.chart_config.include_other_years == true) && (
//                     <Row className="mb-5" gutter={[16, 16]}>
//                         <Col span={24}>
//                             <label htmlFor="year">Year : </label>
//                             <Select 
//                             mode="multiple" 
//                             className="w-18"
//                             placeholder="Select Year"
//                             options={generateYearOptionsBySector(sectors)} 
//                             defaultValue={new Date().getFullYear()} 
//                             onChange={(value : any) => setYears(value)} 
//                             />
//                         </Col>
//                         <Col span={24}>
//                             <label htmlFor="year">Category : </label>
//                             <Select 
//                             placeholder="Select Category"
//                             className="min-w-20"
//                             options={chart.chart_config.y_axis.map((item : any) => ({label : item, value : item}))}
//                             defaultValue={chart.chart_config.y_axis[0]} 
//                             onChange={(value : any) => setCategory(value)} 
//                             />
//                         </Col>
//                     </Row>
//                 )
//             }
//             {
//                 chartData.length <= 0 && (
//                     <Result status="error" title="No data available" />
//                 )
//             }
//             {
//                 !chart.chart_config.include_other_years && chart.chart_config.include_other_years == false && 
//                 (fields.length > 0 && data.length > 0) && (
//                     <ResponsiveContainer width="100%" height={500}>
//                         <BarChart
//                             data={chartData}
//                         >
//                             <YAxis type="number"  />
//                             <XAxis type="category" dataKey={fields.filter(f => f.identifier == chart.chart_config.x_axis)[0].name} />
//                             <Tooltip />
//                             {
//                                 chart.chart_config.y_axis.map((item : any, index : number) => {
//                                     if(chart.chart_config.stacked)
//                                         return (
//                                             <Bar fill={getRandomColor(index)} stackId="a"  key={item} dataKey={fields.filter(f => f.identifier == item)[0].name}  />
//                                         )
//                                     else 
//                                         return (
//                                             <Bar fill={getRandomColor(index)}  key={item} dataKey={fields.filter(f => f.identifier == item)[0].name}  />
//                                         )
//                                 })
//                             }
//                             <Legend />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 )
//             }
//             {
//                 chart.chart_config.include_other_years && chart.chart_config.include_other_years == true && 
//                 (fields.length > 0 && data.length > 0) && (
//                     <ResponsiveContainer width="100%" height={500}>
//                         <BarChart
//                             data={filteredData}
//                         >
//                             <YAxis type="number"  />
//                             <XAxis type="category" dataKey={fields.filter(f => f.identifier == chart.chart_config.x_axis)[0].name} />
//                             <Tooltip />
//                             {
//                                 years.map((item : any, index : number) => {
//                                     return (
//                                         <Bar fill={getRandomColor(index)}  key={index} dataKey={item}  />
//                                     )
//                                 })
//                             }
//                             <Legend />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 )
//             }
//         </Card>
//     )
// }

const VerticalBarChart = ({
    config,
    chart,
    data,
    sectors,
}: {
    config: any;
    chart: any;
    data: any[];
    sectors: any[];
}) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [category, setCategory] = useState<string>("");
    const [sectorIdentifier, setSectorIdentifier] = useState<string>("");

    const getDataByYears = async () => {
        try {
            const _data: any[] = [];
            for (const year of years) {
                const sector = sectors.find(
                    (s) => s.calendar_year === year && s.identifier === sectorIdentifier
                );
                console.log("sectors ", sector);

                if (!sector) {
                    console.warn(`No sector found for year: ${year}`);
                    continue;
                }

                const _config = await reportConfigGetByQuery(
                    { sector: sector._id, identifier: config.identifier },
                    ["data"]
                );

                _data.push({
                    Year: year,
                    data: _config.data[0]?.data.map((d: any) => d.data),
                });
            }

            const _currentYear = config.sector.calendar_year;
            const _chartData = _.uniqBy(
                _data[0]?.data || [],
                chart.chart_config.x_axis
            ).map((d: any) => {
                const ret: any = {
                    [getFieldName(fields, chart.chart_config.x_axis)]: d[chart.chart_config.x_axis],
                };

                _data.forEach((item) => {
                    const yearData = item.data || [];
                    ret[item.Year] = _.sum(
                        yearData
                            .filter(
                                (entry) =>
                                    entry[chart.chart_config.x_axis] ===
                                    ret[getFieldName(fields, chart.chart_config.x_axis)]
                            )
                            .map((entry) => parseInt(entry[category] || 0))
                    );
                });

                return ret;
            });

            setFilteredData(_chartData);
            console.log(_chartData)
        } catch (error) {
            console.error("Failed to fetch data by years:", error);
            message.error(parseResError(error).msg || "An unexpected error occurred.");
        }
    };

    // useEffect(() => {
    //     if (years.length > 0 && category.length > 0) getDataByYears();
    // }, [years, category]);

    useEffect(() => {
        if (chart.chart_config.include_other_years) {
            setYears([new Date().getFullYear()]);
            setCategory(chart.chart_config.y_axis[0]);
        }
    }, [chart.chart_config.include_other_years]);
    
    useEffect(() => {
        if (
            chart.chart_config.include_other_years &&
            years.length > 0 &&
            category &&
            fields.length > 0
        ) {
            getDataByYears();
        }
    }, [chart.chart_config.include_other_years, years, category, fields]);

    useEffect(() => {
        if (data.length > 0 && fields.length > 0) {
            const xAxisField = getFieldName(fields, chart.chart_config.x_axis);
            const _chartData = _.uniqBy(data, chart.chart_config.x_axis).map((d: any) => {
                const ret: any = {
                    [xAxisField]: d[chart.chart_config.x_axis],
                };

                chart.chart_config.y_axis.forEach((item: any) => {
                    const fieldName = getFieldName(fields, item);
                    ret[fieldName] = _.sum(
                        data
                            .filter((a) => a[chart.chart_config.x_axis] === d[chart.chart_config.x_axis])
                            .map((entry) => parseInt(entry[item] || 0))
                    );
                });

                return ret;
            });

            setChartData(_chartData);
        }
    }, [data, fields]);

    useEffect(() => {
        if (config.fields.length > 0) {
            setFields(flattenFields(config.fields));
            setSectorIdentifier(config.sector.identifier);
        }
    }, [config]);

    return (
        <Card className="w-full h-full">
            <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
            {chart.chart_config.include_other_years && (
                <Row className="mb-5" gutter={[16, 16]}>
                    <Col span={24}>
                        <label htmlFor="year">Year : </label>
                        <Select
                            mode="multiple"
                            className="w-18"
                            placeholder="Select Year"
                            options={generateYearOptionsBySector(sectors)}
                            defaultValue={[new Date().getFullYear()]}
                            onChange={(value) => setYears(value)}
                        />
                    </Col>
                    <Col span={24}>
                        <label htmlFor="category">Category : </label>
                        <Select
                            placeholder="Select Category"
                            className="min-w-20"
                            options={chart.chart_config.y_axis.map((item: any) => ({
                                label: item,
                                value: item,
                            }))}
                            defaultValue={chart.chart_config.y_axis[0]}
                            onChange={(value) => setCategory(value)}
                        />
                    </Col>
                </Row>
            )}
            {
                chartData.length === 0 ?  <Result status="error" title="No data available" /> :
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={chart.chart_config.include_other_years ? filteredData : chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis type="number" />
                        <XAxis
                            type="category"
                            dataKey={getFieldName(fields, chart.chart_config.x_axis)}
                        />
                        <Tooltip />
                        {chart.chart_config.include_other_years
                            ? years.map((year, index) => (
                                <Bar
                                    fill={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)}
                                    key={year}
                                    dataKey={year}
                                />
                            ))
                            : chart.chart_config.y_axis.map((item, index) => (
                                <Bar
                                    fill={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)}
                                    key={item}
                                    dataKey={getFieldName(fields, item)}
                                    stackId={chart.chart_config.stacked ? "a" : undefined}
                                />
                            ))}
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
            }

        </Card>
    );
};

const C_PieChart = ({config, chart, data} : {config : any, chart : any, data : any[]}) => {

    const [chartData, setChartData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if(data.length > 0 && fields.length > 0){
            setChartData(
                 _.uniqBy(data, chart.chart_config.category)
                 .map((d:any) => {
                     const _data =  {
                        [fields.filter(f => f.identifier == chart.chart_config.category)[0].name] : d[chart.chart_config.category],
                        [fields.filter(f => f.identifier == chart.chart_config.value)[0].name] : _.sum(data.filter(a => a[chart.chart_config.category] == d[chart.chart_config.category]).map(a => parseInt(a[chart.chart_config.value])))
                     }
                     
                     return _data;
                 })
             );
        }
    }, [data, fields]);

    useEffect(() => {
        console.log(chartData)
    }, [chartData])

    useEffect(() => {
        if(config.fields.length > 0)
            setFields(flattenFields(config.fields));
    }, [config]);

    return (
        <Card className="w-full">
            <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
            {
                chartData.length <= 0 && (
                    <Result status="error" title="No data available" />
                )
            }
            {
                (fields.length > 0 && data.length > 0) && (
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart
                        >
                            <Pie 
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            dataKey={fields.filter(f => f.identifier == chart.chart_config.value)[0].name}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell name={entry[fields.filter(f => f.identifier == chart.chart_config.category)[0].name]} key={entry} fill={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)} ></Cell>
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )
            }
        </Card>
    )
}

const C_LineChart = ({config, chart, data} : {config : any, chart : any, data : any[]}) => {

    const [chartData, setChartData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if(data.length > 0 && fields.length > 0){
            setChartData(
                 _.uniqBy(data, chart.chart_config.category)
                 .map((d:any) => {
                    const _data =  {
                        [fields.filter(f => f.identifier == chart.chart_config.category)[0].name] : d[chart.chart_config.category],
                    }
                    chart.chart_config.lines.forEach((item : any) => {
                        _data[fields.filter(f => f.identifier == item)[0].name] = _.sum(data.filter(a => a[chart.chart_config.category] == d[chart.chart_config.category]).map(d => parseInt(d[item])));
                    });
                    return _data;
                 })
             );
        }
    }, [data, fields]);

    useEffect(() => {
        console.log("line data", chartData)
    }, [chartData])

    useEffect(() => {
        if(config.fields.length > 0)
            setFields(flattenFields(config.fields));
    }, [config]);

    return (
        <Card className="w-full">
            <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
            {
                chartData.length <= 0 && (
                    <Result status="error" title="No data available" />
                )
            }
            {
                (fields.length > 0 && data.length > 0) && (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart
                            data={chartData}
                        >
                            <CartesianGrid />
                            <XAxis dataKey={fields.filter(f => f.identifier == chart.chart_config.category)[0].name} />
                            <YAxis type="number"  />
                            <Tooltip />
                            {
                                chart.chart_config.lines.map((item : any, index) => {
                                    return (<Line key={item} stroke={chart.color_scheme_id ? getRandomColorByScheme(index, chart.color_scheme.colors) : getRandomColor(index)}  dataKey={fields.filter(f => f.identifier == item)[0].name} />)
                                })
                            }
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                )
            }
        </Card>
    )
}

const TabularPresentation = ({config, chart, data} : {config : any, chart : any, data : any[]}) => {

    const [chartData, setChartData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);


    useEffect(() => {
        console.log("line data", chartData)
    }, [chartData])

    useEffect(() => {
        if(config.fields.length > 0)
            setFields(flattenFields(config.fields));
    }, [config]);

    return (
        <Card className="w-full">
            <Typography.Paragraph className="text-center">{chart.title}</Typography.Paragraph>
            {
                data.length <= 0 && (
                    <Result status="error" title="No data available" />
                )
            }
            {
                (fields.length > 0 && data.length > 0) && (
                    <div className={`${data.length == 0 && "hidden"} mx-auto`}>
                        <div className="ag-theme-alpine mt-5" style={{ width: '100%', height: '500px' }}>
                            <AgGridReact 
                            rowData={data} 
                            columnDefs={
                                _.filter(generateColDefs(config.fields), a => {
                                    return [...Object.keys(chart.chart_config.fields).filter(f => chart.chart_config.fields[f])].includes(a.field)
                                })
                            } 
                            onGridReady={(ev) => ev.api.sizeColumnsToFit()}/>
                        </div>
                    </div>
                )
            }
        </Card>
    )
}

const RenderChart = ({config, chart, data, sectors} : {config : any, chart : any, data : any[], sectors : any[]}) => {
    if(chart.type == "Horizontal Bar Chart") return <HorizontalBarChart chart={chart} data={data} config={config} />
    if(chart.type == "Vertical Bar Chart") return <VerticalBarChart sectors={sectors} chart={chart} data={data} config={config} />
    if(chart.type == "Pie Chart") return <C_PieChart chart={chart} data={data} config={config} />
    if(chart.type == "Line Chart") return <C_LineChart chart={chart} data={data} config={config} />
    if(chart.type == "Tabular Presentation") return <TabularPresentation chart={chart} data={data} config={config} />
    return (<></>);
}

const ReportDashboard = () => {

    const { _id } = useParams();
    const [charts, setCharts] = useState([]);
    const [config, setConfig] = useState<any>({});
    const [data, setData] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [sectors, setSectors] = useState<any[]>([]);

    const init = async () => {
        try {
            const config = (await reportConfigGetByQuery({_id : _id}, 
                [
                    "sector", 
                    { path : "charts", populate : { path : "color_scheme" }}, 
                    ["data"]
                ])).data[0];
            setConfig(config);
            setCharts(config.charts);
            setData(config.data.map(d => d.data));   
            getSectors();
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    const getSectors = async () => {
        try {
            const _sectors = (await sectorGetByQuery({}, [])).data;
            setSectors(_sectors);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        init();
    }, [_id, refresh]);

    const setSpans = (chart) => {
        if(chart.type == "Tabular Presentation")
            return 24;
        return 12
    }

    return (
        <div>
            <Title level={4}>{config.name}</Title>
            {
                charts.length > 0 ? (
                    <>
                        <Button onClick={() => setRefresh(!refresh)} icon={<ReloadOutlined />}>Reload</Button>
                        <Row align={"stretch"} gutter={[16, 16]}>
                            {charts.map((chart, index) => {
                                return (
                                    <Col className="p-3 h-100" key={index} xs={24} sm={24} md={24} lg={24} xl={24}>
                                    {/* <Col className="p-3 h-100" key={index} xs={24} sm={24} md={24} lg={24} xl={setSpans(chart)}> */}
                                        <RenderChart sectors={sectors} chart={chart} data={data} config={config} />
                                    </Col>
                                )
                            })}
                        </Row>
                    </>
                ) : (
                    (<Result status="404" title="No charts found"  />)
                )
            }
        </div>
    );
}

export default ReportDashboard;