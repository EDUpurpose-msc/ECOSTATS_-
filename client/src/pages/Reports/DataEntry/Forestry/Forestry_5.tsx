
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_5, { forestry_5_col_defs, forestry_5_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_5";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Forestry_5 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'name_of_watershed', field: 'name_of_watershed', type: DataMigratorColTypes.string },
        { headerName: 'previous_name_of_watershed', field: 'previous_name_of_watershed', type: DataMigratorColTypes.string },
        { headerName: 'area_ha', field: 'area_ha', type: DataMigratorColTypes.number },
        { headerName: 'classification', field: 'classification', type: DataMigratorColTypes.string },
        { headerName: 'municipalities', field: 'municipalities', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_5, Sector.FORESTRY)
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
            children: <Forestry_Table_5 />,
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
                        formName={FormEnum.FORESTRY_5} 
                        sector={Sector.FORESTRY} 
                        fields={forestry_5_gen_form_fields}
                        colDefs={forestry_5_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Priority Critical Watershed Supporting National Irrigation System</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_5;
