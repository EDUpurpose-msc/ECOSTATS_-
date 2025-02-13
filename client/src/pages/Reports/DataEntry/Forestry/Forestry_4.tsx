
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Forestry_Table_4, { forestry_4_col_defs, forestry_4_gen_form_fields } from "../../../../components/Reports/Forms/Forestry/Forestry_Table_4";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Forestry_4 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'watershed_reservation_name', field: 'watershed_reservation_name', type: DataMigratorColTypes.string },
        { headerName: 'location', field: 'location', type: DataMigratorColTypes.string },
        { headerName: 'area_ha', field: 'area_ha', type: DataMigratorColTypes.number },
        { headerName: 'presidential_proclamation_no', field: 'presidential_proclamation_no', type: DataMigratorColTypes.string },
        { headerName: 'proclamation_date', field: 'proclamation_date', type: DataMigratorColTypes.date },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.FORESTRY_4, Sector.FORESTRY)
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
            children: <Forestry_Table_4 />,
        },
        {
            key: '2',
            label: 'Migration',
            children: <DataMigrator columns={columns} onSave={handleSave} />,
        },
        {
            key: '4',
            label: 'Reports',
            children: <CustomReport 
                        formName={FormEnum.FORESTRY_4} 
                        sector={Sector.FORESTRY} 
                        fields={forestry_4_gen_form_fields}
                        colDefs={forestry_4_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Proclaimed Watershed Forest Reserve</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Forestry_4;
