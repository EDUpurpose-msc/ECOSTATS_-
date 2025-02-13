
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_29, { biodiversity_29_col_defs, biodiversity_29_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_29";


const Biodiversity_29 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'species.common_name', field: 'species.common_name', type: DataMigratorColTypes.string },
        { headerName: 'species.scientific_name', field: 'species.scientific_name', type: DataMigratorColTypes.string },
        { headerName: 'quantity', field: 'quantity', type: DataMigratorColTypes.number },
        { headerName: 'date', field: 'date', type: DataMigratorColTypes.date },
        { headerName: 'mode_of_acquisition', field: 'mode_of_acquisition', type: DataMigratorColTypes.string },
        { headerName: 'donor', field: 'donor', type: DataMigratorColTypes.string },
        { headerName: 'physical_condition', field: 'physical_condition', type: DataMigratorColTypes.string },
        { headerName: 'action_taken', field: 'action_taken', type: DataMigratorColTypes.string },
        { headerName: 'status', field: 'status', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => { 
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_29, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_29 />,
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
                        formName={FormEnum.BIODIVERSITY_29} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_29_gen_form_fields}
                        colDefs={biodiversity_29_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Wild Flora Retrieval and Donation</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_29;
