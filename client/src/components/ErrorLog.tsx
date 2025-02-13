import { Drawer } from "antd";
import { useEffect, useState } from "react";
import ReactJson from '@microlink/react-json-view'
import { useErrorLogStore } from "../stores/useErrorLogStore";
import Title from "antd/es/typography/Title";

const ErrorLog = () => {

    const errorLogStore = useErrorLogStore();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(errorLogStore.error){
            setOpen(true)
        }
        else{
            setOpen(false)
        }
    }, [errorLogStore.error])

    return (
        <>
            <Drawer size="large" open={open} onClose={() => errorLogStore.setError(null)}>
                <Title level={4}>Error Log</Title>
                <ReactJson src={errorLogStore.error} />
            </Drawer>
        </>
    )
}

export default ErrorLog;