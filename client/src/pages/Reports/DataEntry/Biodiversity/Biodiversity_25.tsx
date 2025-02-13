
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_23, { biodiversity_23_col_defs, biodiversity_23_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_23";
import Biodiversity_Table_25, { biodiversity_25_col_defs, biodiversity_25_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_25";


const Biodiversity_25 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'taxonomic_group', field: 'taxonomic_group', type: DataMigratorColTypes.number },
        { headerName: 'no_of_species', field: 'no_of_species', type: DataMigratorColTypes.number },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => { 
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_25, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_25 />,
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
                        formName={FormEnum.BIODIVERSITY_25} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_25_gen_form_fields}
                        colDefs={biodiversity_25_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Endemic Flora Species by Taxonomic Group</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_25;
