
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_5, { forestry_5_col_defs, forestry_5_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_5";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Forestry_Table_6, { forestry_6_col_defs, forestry_6_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_6";


const Forestry_6 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: "organization_name", field: "organization_name", type: DataMigratorColTypes.string },
        { headerName: "area", field: "area", type: DataMigratorColTypes.number },
        { headerName: "beneficiaries.total", field: "beneficiaries.total", type: DataMigratorColTypes.number },
        { headerName: "beneficiaries.male", field: "beneficiaries.male", type: DataMigratorColTypes.number },
        { headerName: "beneficiaries.female", field: "beneficiaries.female", type: DataMigratorColTypes.number },
        { headerName: "carp", field: "carp", type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_6, Sector.FORESTRY)
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
            children: <Forestry_Table_6 />,
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
                        formName={FormEnum.FORESTRY_6} 
                        sector={Sector.FORESTRY} 
                        fields={forestry_6_gen_form_fields}
                        colDefs={forestry_6_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Existing Community-Based Forest Management Agreement </Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_6;
