
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_3, { biodiversity_3_col_defs, biodiversity_3_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_3";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_3 = () => {

    const errorLogStore = useErrorLogStore();
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'date_of_inventory', field: 'date_of_inventory', type: DataMigratorColTypes.date },
        { headerName: 'area_assessed', field: 'area_assessed', type: DataMigratorColTypes.number },
        { headerName: 'status_percentage', field: 'status_percentage', type: DataMigratorColTypes.number },
        { headerName: 'dominant_species', field: 'dominant_species', type: DataMigratorColTypes.string },
        { headerName: 'types_of_substrate', field: 'types_of_substrate', type: DataMigratorColTypes.string },
        { headerName: 'condition.quantitative_interpretation', field: 'condition.quantitative_interpretation', type: DataMigratorColTypes.number },
        { headerName: 'condition.qualitative_interpretation', field: 'condition.qualitative_interpretation', type: DataMigratorColTypes.string },
        { headerName: 'year_assessed', field: 'year_assessed', type: DataMigratorColTypes.number },
    ];

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_3, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_3 />,
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
                        formName={FormEnum.BIODIVERSITY_3} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_3_gen_form_fields}
                        colDefs={biodiversity_3_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            
            <Title level={4} >Inventory of Coral Reef</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_3;
