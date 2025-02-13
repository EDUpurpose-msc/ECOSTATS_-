
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_32, { biodiversity_32_col_defs, biodiversity_32_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_32";


const Biodiversity_32 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'species', field: 'species', type: DataMigratorColTypes.string },
        { headerName: 'date_encountered', field: 'date_encountered', type: DataMigratorColTypes.date },
        { headerName: 'tag_no', field: 'tag_no', type: DataMigratorColTypes.string },
        { headerName: 'tagging', field: 'tagging', type: DataMigratorColTypes.string },
        { headerName: 'date_released', field: 'date_released', type: DataMigratorColTypes.date },
        
       
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => { 
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_32, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_32 />,
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
                        formName={FormEnum.BIODIVERSITY_32} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_32_gen_form_fields}
                        colDefs={biodiversity_32_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Marine Turtles Tagged and Released</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_32;
