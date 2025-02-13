
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_9, { biodiversity_9_col_defs, biodiversity_9_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_9";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_9 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'barangay', field: 'barangay', type: DataMigratorColTypes.string },
        { headerName: 'name_of_cave', field: 'name_of_cave', type: DataMigratorColTypes.string },
        { headerName: 'other_cave_name', field: 'other_cave_name', type: DataMigratorColTypes.string },
        { headerName: 'classification_per_dmc', field: 'classification_per_dmc', type: DataMigratorColTypes.string },
        { headerName: 'dmc_no', field: 'dmc_no', type: DataMigratorColTypes.string },
        { headerName: 'presence_of_management_plan', field: 'presence_of_management_plan', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_9, Sector.BIODIVERSITY)
        .then(res => {
            messageApi.success("Data successfully updated.");
        })
        .catch(err => {
            if(err.response.status == 422){
                errorLogStore.setError(err.response.data)
            }
            messageApi.error(parseResError(err).msg);
            console.log(err)
        })
        .finally();
    };
    
    const items : TabsProps['items'] = [
        {
            key: '1',
            label: 'Form',
            children: <Biodiversity_Table_9 />,
        },
        {
            key: '2',
            label: 'Migration',
            children: <DataMigrator columns={columns} onSave={handleSave} />,
        },
        {
            key: '3',
            label: 'Reports',
            children: <CustomReport 
                        formName={FormEnum.BIODIVERSITY_9} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_9_gen_form_fields}
                        colDefs={biodiversity_9_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Classified Caves</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_9;
