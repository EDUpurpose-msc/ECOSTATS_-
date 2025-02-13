import { Button, Flex, Grid, List, message, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import AddColorScheme from "../../../components/Admin/Configurations/AddColorScheme";
import { useEffect, useState } from "react";
import { parseResError } from "../../../services/errorHandler";
import { colorSchemeGetByQuery } from "../../../services/api/colorSchemeApi";
import UpdateColorScheme from "../../../components/Admin/Configurations/UpdateColorScheme";


const ColorSchemeConfiguration = () => {
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [colorSchemes, setColorSchemes] = useState([]);
    const [colorSchemeUpdate, setColorSchemeUpdate] = useState(null);

    const init = async () => {
        try {
            setColorSchemes((await colorSchemeGetByQuery({}, [])).data);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        init();
    }, [refresh]);

    return (
        <>
            <Title level={3}>Color Schemes</Title>
            <Button type="primary" onClick={() => setOpen(true)}>Create New</Button>

            <List
                bordered
                style={{marginTop: '1em'}}
                dataSource={colorSchemes}
                renderItem={(item:any) => (
                    <>
                    <List.Item>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                            <div className="font-bold">{item.name}</div>
                            <div className="flex flex-wrap gap-2">
                                {item.colors.map((color, index) => (
                                    <Tooltip key={index} title={color}>
                                        <div className="h-5 w-5 rounded-full" style={{backgroundColor: color}}></div>
                                    </Tooltip>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button type="primary" size="small" onClick={() => setColorSchemeUpdate(item)}>Edit</Button>
                            </div>
                        </div>
                    </List.Item>
                    </>
                )}
            />

            <AddColorScheme open={open} onClose={() => {
                    setOpen(false)
                    setRefresh(!refresh)
                }} 
            /> 
            <UpdateColorScheme colorScheme={colorSchemeUpdate} onClose={() => {
                    setOpen(false)
                    setColorSchemeUpdate(null);
                    setRefresh(!refresh)
                }} 
            /> 
        </>
    )
}

export default ColorSchemeConfiguration;