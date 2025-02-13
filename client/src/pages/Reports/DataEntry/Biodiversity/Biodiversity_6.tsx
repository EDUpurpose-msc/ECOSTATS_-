
import { message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import Biodiversity_Table_6, { biodiversity_6_col_defs, biodiversity_6_gen_form_fields } from "../../../../components/Reports/Forms/Biodiversity/Biodiversity_Table_6";
import DataMigrator, { DataMigratorCol, DataMigratorColTypes } from "../../../../components/DataMigrator";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { formSaveMany } from "../../../../services/api/formsApi";
import { parseResError } from "../../../../services/errorHandler";
import { useErrorLogStore } from "../../../../stores/useErrorLogStore";
import CustomReport from "../../../../components/CustomReport/CustomReport";


const Biodiversity_6 = () => {

    const [messageApi, contextHandler] = message.useMessage();
    
    const columns : DataMigratorCol[] = [
        { headerName: 'calendar_year', field: 'calendar_year', type: DataMigratorColTypes.number },
        { headerName: 'province', field: 'province', type: DataMigratorColTypes.string },
        { headerName: 'municipality', field: 'municipality', type: DataMigratorColTypes.string },
        { headerName: 'rehabilitated_area', field: 'rehabilitated_area', type: DataMigratorColTypes.number },
        { headerName: 'date_established', field: 'date_established', type: DataMigratorColTypes.number },
        { headerName: 'date_rehabilitated', field: 'date_rehabilitated', type: DataMigratorColTypes.number },
        { headerName: 'species_identified', field: 'species_identified', type: DataMigratorColTypes.string },
        { headerName: 'fund_source', field: 'fund_source', type: DataMigratorColTypes.string },
        
    ];
    const errorLogStore = useErrorLogStore();

    const handleSave = (data) => {
        formSaveMany(data, FormEnum.BIODIVERSITY_6, Sector.BIODIVERSITY)
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
            children: <Biodiversity_Table_6 />,
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
                    formName={FormEnum.BIODIVERSITY_6} 
                    sector={Sector.BIODIVERSITY} 
                    fields={biodiversity_6_gen_form_fields}
                    colDefs={biodiversity_6_col_defs} />
        },
    ]
    return (
        <>
            { contextHandler }
            <Title level={4} >Mangrove Area Rehabilitated</Title>
            <Tabs items={items} defaultActiveKey="1" />
        </>
    )
}

export default Biodiversity_6;
