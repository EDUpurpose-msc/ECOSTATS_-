
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Land_Table_3, { land_3_col_defs, land_3_gen_form_fields } from "../../../../components/Reports/Forms/Land/Land_Table_3";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Land_3 = () => {
    const errorLogStore = useErrorLogStore();
    
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'transmitted_to_RoD', field: 'transmitted_to_RoD', type: DataMigratorColTypes.number },
        { headerName: 'area', field: 'area', type: DataMigratorColTypes.number },
        { headerName: 'beneficiaries.total', field: 'beneficiaries.total', type: DataMigratorColTypes.number },
        { headerName: 'beneficiaries.male', field: 'beneficiaries.male', type: DataMigratorColTypes.number },
        { headerName: 'beneficiaries.female', field: 'beneficiaries.female', type: DataMigratorColTypes.number },
    ];

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.LAND_3, Sector.LAND)
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
            children: <Land_Table_3 />,
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
                        formName={FormEnum.LAND_3} 
                        sector={Sector.LAND} 
                        fields={land_3_gen_form_fields}
                        colDefs={land_3_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Residential Free Patent Issued</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Land_3;
