
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_1, { forestry_1_col_defs, forestry_1_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_1";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Forestry_1 = () => {
    const errorLogStore = useErrorLogStore();

    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'total_land_area', field: 'total_land_area', type: DataMigratorColTypes.number },
        { headerName: 'certified_a_n_d', field: 'certified_a_n_d', type: DataMigratorColTypes.number },
        { headerName: 'forestland.total_forestland', field: 'forestland.total_forestland', type: DataMigratorColTypes.number },
        { headerName: 'forestland.unclassified_forestland_ha', field: 'forestland.unclassified_forestland_ha', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.total_classified_forestland', field: 'forestland.classified_forestland.total_classified_forestland', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.established_forest_reserves', field: 'forestland.classified_forestland.established_forest_reserves', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.established_timberland', field: 'forestland.classified_forestland.established_timberland', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.national_parks_and_grbs_wa', field: 'forestland.classified_forestland.national_parks_and_grbs_wa', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.military_and_naval_reservations', field: 'forestland.classified_forestland.military_and_naval_reservations', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.civil_registration', field: 'forestland.classified_forestland.civil_registration', type: DataMigratorColTypes.number },
        { headerName: 'forestland.classified_forestland.fishpond', field: 'forestland.classified_forestland.fishpond', type: DataMigratorColTypes.number },
    ]

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_1, Sector.FORESTRY)
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
            children: <Forestry_Table_1 />,
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
                    formName={FormEnum.FORESTRY_1} 
                    sector={Sector.FORESTRY} 
                    fields={forestry_1_gen_form_fields}
                    colDefs={forestry_1_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Land Classification</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_1;
