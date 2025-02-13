
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_4, { biodiversity_4_col_defs, biodiversity_4_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_4";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_4 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'date_of_inventory', field: 'date_of_inventory', type: DataMigratorColTypes.date },
        { headerName: 'area', field: 'area', type: DataMigratorColTypes.number },
        { headerName: 'dominant_species', field: 'dominant_species', type: DataMigratorColTypes.string },
        { headerName: 'status', field: 'status', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_4, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_4 />,
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
                        formName={FormEnum.BIODIVERSITY_4} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_4_gen_form_fields}
                        colDefs={biodiversity_4_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Inventory of Seagrass</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_4;
