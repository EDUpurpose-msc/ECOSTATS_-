
import { message, Tabs, TabsProps } from "antd";
import Land_Table_1, { land_1_col_defs, land_1_gen_form_fields } from "../../../../components/Reports/Forms/Land/Land_Table_1";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Land_1 = () => {
    const errorLogStore = useErrorLogStore();
    
    const [messageApi, contextHandler] = message.useMessage();

    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'contested_area', field: 'contested_area', type: DataMigratorColTypes.number },
        { headerName: 'uncontested_area', field: 'uncontested_area', type: DataMigratorColTypes.number },
    ];

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.LAND_1, Sector.LAND)
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
            children: <Land_Table_1 />,
        },
        {
            key: '2',
            label: 'Migration',
            children: <DataMigrator onSave={handleSave} columns={columns} />,
        },
        {
            key: '3',
            label: 'Reports',
            children: <CustomReport 
                        formName={FormEnum.LAND_1} 
                        sector={Sector.LAND} 
                        fields={land_1_gen_form_fields}
                        colDefs={land_1_col_defs} />
        }
    ];

    
    return (
        <>
            {contextHandler}
            <Title level={4} >Land Area</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Land_1;
