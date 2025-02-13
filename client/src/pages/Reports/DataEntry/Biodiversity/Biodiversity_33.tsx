
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_33, { biodiversity_33_col_defs, biodiversity_33_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_33";


const Biodiversity_33 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'species', field: 'species', type: DataMigratorColTypes.string },
        { headerName: 'numbers.released', field: 'numbers.released', type: DataMigratorColTypes.number },
        { headerName: 'numbers.mortality', field: 'numbers.mortality', type: DataMigratorColTypes.number },
        { headerName: 'numbers.under_rehabilitation', field: 'numbers.under_rehabilitation', type: DataMigratorColTypes.number },
        { headerName: 'numbers.total', field: 'numbers.total', type: DataMigratorColTypes.number },
        
       
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => { 
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_33, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_33 />,
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
                        fields={biodiversity_33_gen_form_fields}
                        colDefs={biodiversity_33_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Stranded Marine Turtle</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_33;
