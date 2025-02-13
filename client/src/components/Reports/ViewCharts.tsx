import { Button, Drawer, Flex, List, message, Popconfirm, Typography } from "antd"
import { useViewChartStore } from "../../stores/useReportStore";
import { useEffect, useState } from "react";
import { reportConfigDelete } from "../../services/api/reportConfigApi";
import { parseResError } from "../../services/errorHandler";
import { chartConfigDelete } from "../../services/api/chartConfigApi";

const RenderConfigs = ({chart} : {chart:any}) => {


    if(chart.type == "Horizontal Bar Chart"){
        return (
            <>
                <div>
                    <Typography.Text strong>Stacked : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.stacked ? "True" : "False"}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>Y Axis : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.y_axis}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>X Axis : </Typography.Text> 
                    {
                        chart.chart_config.x_axis.map((item : any, index : number) => {
                            return (
                                <Typography.Text code key={index}>{item}</Typography.Text>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    if(chart.type == "Vertical Bar Chart"){
        return (
            <>
                <div>
                    <Typography.Text strong>Stacked : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.stacked ? "True" : "False"}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>X Axis : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.x_axis}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>Y Axis : </Typography.Text> 
                    {
                        chart.chart_config.y_axis.map((item : any, index : number) => {
                            return (
                                <Typography.Text code key={index}>{item}</Typography.Text>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    if(chart.type == "Pie Chart"){
        return (
            <>
                <div>
                    <Typography.Text strong>Category : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.category}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>Value : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.value}</Typography.Text>
                </div>
            </>
        )
    }
    if(chart.type == "Line Chart"){
        return (
            <>
                <div>
                    <Typography.Text strong>Category : </Typography.Text> 
                    <Typography.Text code>{chart.chart_config.category}</Typography.Text>
                </div>
                <div>
                    <Typography.Text strong>Lines : </Typography.Text> 
                    {
                        chart.chart_config.lines.map((item : any, index : number) => {
                            return (
                                <Typography.Text code key={index}>{item}</Typography.Text>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    if(chart.type == "Tabular Presentation"){
        return (
            <>
                <div>
                    <Typography.Text strong>Included Fields : </Typography.Text> 
                    {
                        Object.keys(chart.chart_config.fields).filter(v => chart.chart_config.fields[v]).map((item : any, index : number) => {
                            return (
                                <Typography.Text code key={index}>{item}</Typography.Text>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    return (<></>)
}

const ViewCharts = ({onClose}) => {

    const { charts, setCharts } = useViewChartStore();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        console.log(charts);
    }, [charts]);

    const handleDelete = async (id) => {
        setIsDeleting(true);
        try {
            await chartConfigDelete(id);
            message.success("Report Config deleted successfully.");
            setCharts(charts.filter((chart) => chart._id !== id));
        } catch (error) {
            message.error(parseResError(error).msg, 10);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Drawer 
            open={charts.length > 0}
            onClose={() => {
                setCharts([])
                onClose();
            }}
            title="Charts Configuration">
            <List 
                dataSource={charts} 
                bordered
                renderItem={(chart) => {
                    return (
                        <List.Item className="w-full">
                            <Flex vertical justify="end">
                                <Flex className="w-full">
                                    <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this chart?" onConfirm={() => handleDelete(chart._id)}>
                                        <Button loading={isDeleting} size="small" color="danger" variant="filled">Delete</Button>
                                    </Popconfirm>
                                </Flex>
                                <Typography.Text><Typography.Text strong>Title:</Typography.Text> {chart.title}</Typography.Text>
                                <Typography.Text><Typography.Text strong>Type:</Typography.Text> {chart.type}</Typography.Text>
                                <RenderConfigs chart={chart} />
                                <Typography.Text><Typography.Text strong>Color Scheme:</Typography.Text> {chart.color_scheme ? chart.color_scheme.name : "Default"}</Typography.Text>
                            </Flex>
                        </List.Item>
                    )
                }}    
            >

            </List>
        </Drawer>
    )
}

export default ViewCharts;