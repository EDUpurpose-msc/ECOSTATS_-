
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_5, { biodiversity_5_col_defs, biodiversity_5_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_5";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_5 = () => {
    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'assessed_area', field: 'assessed_area', type: DataMigratorColTypes.number },
        { headerName: 'date_of_assessment', field: 'date_of_assessment', type: DataMigratorColTypes.date },
        { headerName: 'species_identified', field: 'species_identified', type: DataMigratorColTypes.string },
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_5, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_5 />,
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
                    formName={FormEnum.BIODIVERSITY_5} 
                    sector={Sector.BIODIVERSITY} 
                    fields={biodiversity_5_gen_form_fields}
                    colDefs={biodiversity_5_col_defs} />
        },
    ];

    return (
        <>
            <Title level={4} >Mangrove Assessment</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_5;
