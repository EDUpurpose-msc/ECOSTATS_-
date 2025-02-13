
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { formSaveMany } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";
import Biodiversity_Table_30, { biodiversity_30_col_defs, biodiversity_30_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_30";


const Biodiversity_30 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'classification', field: 'classification', type: DataMigratorColTypes.string },
        { headerName: 'no_of_heads', field: 'no_of_heads', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_acquisition.heads_confiscated', field: 'mode_of_acquisition.heads_confiscated', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_acquisition.heads_donated', field: 'mode_of_acquisition.heads_donated', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_acquisition.heads_rescued', field: 'mode_of_acquisition.heads_rescued', type: DataMigratorColTypes.number },
        { headerName: 'mortality', field: 'mortality', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_disposition.heads_donated', field: 'mode_of_disposition.heads_donated', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_disposition.heads_loaned', field: 'mode_of_disposition.heads_loaned', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_disposition.heads_turned_over', field: 'mode_of_disposition.heads_turned_over', type: DataMigratorColTypes.number },
        { headerName: 'mode_of_disposition.heads_released', field: 'mode_of_disposition.heads_released', type: DataMigratorColTypes.number },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => { 
        console.log(data)
        formSaveMany(data, FormEnum.BIODIVERSITY_30, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_30 />,
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
                        formName={FormEnum.BIODIVERSITY_30} 
                        sector={Sector.BIODIVERSITY} 
                        fields={biodiversity_30_gen_form_fields}
                        colDefs={biodiversity_30_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Inventory of Wildlife at DENR Established Wildlife Rescue Centers</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_30;
