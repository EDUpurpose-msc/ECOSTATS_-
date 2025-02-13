
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_16, { biodiversity_16_col_defs, biodiversity_16_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_16";


const Biodiversity_16 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'taxonomic_group', field: 'taxonomic_group', type: DataMigratorColTypes.string },
        { headerName: 'quantity_collected', field: 'quantity_collected', type: DataMigratorColTypes.number },
        { headerName: 'number_of_permits_issued', field: 'number_of_permits_issued', type: DataMigratorColTypes.number },
        { headerName: 'revenue_generated', field: 'revenue_generated', type: DataMigratorColTypes.number },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_16, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_16 />,
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
                        formName={FormEnum.BIODIVERSITY_16} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_16_gen_form_fields}
                        colDefs={biodiversity_16_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Gratuitous Permit (GP)</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_16;
