
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_9, { biodiversity_9_col_defs, biodiversity_9_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_9";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_10, { biodiversity_10_col_defs, biodiversity_10_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_10";


const Biodiversity_10 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'name_of_critical_habitat', field: 'name_of_critical_habitat', type: DataMigratorColTypes.string },
        { headerName: 'legal_instrument', field: 'legal_instrument', type: DataMigratorColTypes.string },
        { headerName: 'area', field: 'area', type: DataMigratorColTypes.number },
        { headerName: 'threatened_species', field: 'threatened_species', type: DataMigratorColTypes.string },
        { headerName: 'remarks', field: 'remarks', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_10, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_10 />,
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
                        formName={FormEnum.BIODIVERSITY_10} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_10_gen_form_fields}
                        colDefs={biodiversity_10_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Identified/Assessed Critical Habitats</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_10;
