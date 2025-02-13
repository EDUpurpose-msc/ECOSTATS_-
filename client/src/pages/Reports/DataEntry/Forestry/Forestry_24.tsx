
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_24, { forestry_24_col_defs, forestry_24_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_24";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Forestry_24 = () => {

    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'number_of_chainsaw_registered', field: 'number_of_chainsaw_registered', type: DataMigratorColTypes.number },
        { headerName: 'area_of_operation', field: 'area_of_operation', type: DataMigratorColTypes.string },
        { headerName: 'number_of_chainsaw_operator', field: 'number_of_chainsaw_operator', type: DataMigratorColTypes.number },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_24, Sector.FORESTRY)
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
            children: <Forestry_Table_24 />,
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
                        formName={FormEnum.FORESTRY_24} 
                        sector={Sector.FORESTRY} 
                        fields={forestry_24_gen_form_fields}
                        colDefs={forestry_24_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Issued Chainsaw Registration</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_24;
