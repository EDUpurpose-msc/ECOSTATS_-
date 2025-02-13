
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_2, { forestry_2_col_defs, forestry_2_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_2";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Forestry_2 = () => {
    const errorLogStore = useErrorLogStore();
    
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'total_land_cover_area', field: 'total_land_cover_area', type: DataMigratorColTypes.number },
        { headerName: 'forest_cover.total_forest_cover', field: 'forest_cover.total_forest_cover', type: DataMigratorColTypes.number },
        { headerName: 'forest_cover.closed_forest', field: 'forest_cover.closed_forest', type: DataMigratorColTypes.number },
        { headerName: 'forest_cover.open_forest', field: 'forest_cover.open_forest', type: DataMigratorColTypes.number },
        { headerName: 'forest_cover.mangrove_forest', field: 'forest_cover.mangrove_forest', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.total_other_land_cover', field: 'other_land_cover.total_other_land_cover', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.brush_shrubs', field: 'other_land_cover.brush_shrubs', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.grassland', field: 'other_land_cover.grassland', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.annual_crop', field: 'other_land_cover.annual_crop', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.perennial_crop', field: 'other_land_cover.perennial_crop', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.open_barren_land', field: 'other_land_cover.open_barren_land', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.built_up_area', field: 'other_land_cover.built_up_area', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.fishpond', field: 'other_land_cover.fishpond', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.marshland_swamp', field: 'other_land_cover.marshland_swamp', type: DataMigratorColTypes.number },
        { headerName: 'other_land_cover.inland_water', field: 'other_land_cover.inland_water', type: DataMigratorColTypes.number },
        
    ]

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_2, Sector.FORESTRY)
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
            children: <Forestry_Table_2 />,
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
                    formName={FormEnum.FORESTRY_2} 
                    sector={Sector.FORESTRY} 
                    fields={forestry_2_gen_form_fields}
                    colDefs={forestry_2_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Land Cover</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_2;
