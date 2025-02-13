
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Land_Table_5, { land_5_col_defs, land_5_gen_form_fields } from "../../../../components/Reports/Forms/Land/Land_Table_5";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
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
        { headerName: 'no_of_transmitted_to_rod', field: 'no_of_transmitted_to_rod', type: DataMigratorColTypes.number },
        { headerName: 'area_ha', field: 'area_ha', type: DataMigratorColTypes.number },
        { headerName: 'total_beneficiaries', field: 'total_beneficiaries', type: DataMigratorColTypes.number },
        { headerName: 'female_beneficiaries', field: 'female_beneficiaries', type: DataMigratorColTypes.number },
        { headerName: 'male_beneficiaries', field: 'male_beneficiaries', type: DataMigratorColTypes.string },
    ];

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.LAND_5, Sector.LAND)
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
            children: <Land_Table_5 />,
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
                    formName={FormEnum.LAND_5} 
                    sector={Sector.LAND} 
                    fields={land_5_gen_form_fields}
                    colDefs={land_5_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Homestead</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Land_5;
