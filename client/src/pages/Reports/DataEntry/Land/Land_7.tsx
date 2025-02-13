
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Land_Table_7, { land_7_col_defs, land_7_gen_form_fields } from "../../../../components/Reports/Forms/Land/Land_Table_7";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Land_5 = () => {

    const errorLogStore = useErrorLogStore();
    
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'no_of_lots', field: 'no_of_lots', type: DataMigratorColTypes.number },
        { headerName: 'total_land_area_ha', field: 'total_land_area_ha', type: DataMigratorColTypes.number },
        { headerName: 'total_forecasted_annual_revenue', field: 'total_forecasted_annual_revenue', type: DataMigratorColTypes.number },
    ];

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.LAND_7, Sector.LAND)
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
            children: <Land_Table_7 />,
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
                        formName={FormEnum.LAND_7} 
                        sector={Sector.LAND} 
                        fields={land_7_gen_form_fields}
                        colDefs={land_7_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Management of Foreshore Areas</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Land_5;
