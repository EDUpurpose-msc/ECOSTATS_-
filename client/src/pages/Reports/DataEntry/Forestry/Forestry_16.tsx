
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Forestry_Table_15, { forestry_15_col_defs, forestry_15_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_15";
import Forestry_Table_16, { forestry_16_col_defs, forestry_16_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_16";

const Forestry_16 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: "area", field: "area", type: DataMigratorColTypes.number },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_16, Sector.FORESTRY)
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
            children: <Forestry_Table_16 />,
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
                        formName={FormEnum.FORESTRY_16} 
                        sector={Sector.FORESTRY} 
                        fields={forestry_16_gen_form_fields}
                        colDefs={forestry_16_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Industrial Tree Plantation Lease Agreement (ITPLA)</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_16;
