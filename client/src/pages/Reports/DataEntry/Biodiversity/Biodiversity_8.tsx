
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_8, { biodiversity_8_col_defs, biodiversity_8_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_8";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_8 = () => {

    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'name_of_wetland', field: 'name_of_wetland', type: DataMigratorColTypes.string },
        { headerName: 'wetland_type', field: 'wetland_type', type: DataMigratorColTypes.string },
        { headerName: 'wet_area_dry_season_ha', field: 'wet_area_dry_season_ha', type: DataMigratorColTypes.number },
        { headerName: 'wet_area_wet_season_ha', field: 'wet_area_wet_season_ha', type: DataMigratorColTypes.number },
        { headerName: 'assessed', field: 'assessed', type: DataMigratorColTypes.string },
        { headerName: 'presence_of_management_plan', field: 'presence_of_management_plan', type: DataMigratorColTypes.string },
        { headerName: 'recognition', field: 'recognition', type: DataMigratorColTypes.string },
        { headerName: 'remarks', field: 'remarks', type: DataMigratorColTypes.string },
       
        
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_8, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_8 />,
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
                        formName={FormEnum.BIODIVERSITY_8} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_8_gen_form_fields}
                        colDefs={biodiversity_8_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Inland Wetland in the Region</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_8;
