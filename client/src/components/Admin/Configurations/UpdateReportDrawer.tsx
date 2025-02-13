import { Drawer, Form } from "antd"
import { useUpdateReportConfigStore } from "../../../stores/useReportConfigStore"

const RecursiveFields = ({ fields } : { fields : any[] }) => {
    return (
        <>
        
        </>
    )
}

const UpdateReportDrawer = ({onClose}) => {

    const updateReportStore = useUpdateReportConfigStore();

    const [form] = Form.useForm();

    return (
        <Drawer 
            width="100%"
            onClose={() => updateReportStore.setReportData({})}
            open={Object.keys(updateReportStore.reportData).length > 0}
        >
            <RecursiveFields fields={updateReportStore.reportData.fields} />
        </Drawer>
    )
}

export default UpdateReportDrawer;