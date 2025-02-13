import { useEffect, useState } from "react";
import { parseResError } from "../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../services/api/formsApi";
import { FormEnum, Sector } from "../../types/forms/formNameEnum";
import { Button, Checkbox, DatePicker, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { GenericFormFieldV3 } from "../../types/forms/GenericFormTypes";
import { flattenFields, generateColDefs, municipalityOptions } from "../../services/helper";
import { reportDataCreate, reportDataDelete, reportDataGetByQuery, reportDataUpdate } from "../../services/api/reportDataApi";
import GenericFormDrawer from "../GenericFormV4";
import _ from "lodash";


export const generateGenericFields  = (fields : any[]) : GenericFormFieldV3[] => {
    return flattenFields(fields).filter(field => field.identifier && field.name).map(field => {
      const _field : GenericFormFieldV3 = {
        label : field.name,
        name : field.identifier,
        required : true,
        input :( <Input type="text" />),
        type : field.is_nested ? "title" : "input",
      }
  
      if(!field.is_nested && !field.editable && !field.computed_value){
        _field.initialValue = field.default;
        if(field.input_type === "enum"){
            _field.input = (<Select disabled options={field.values.map((v : any) => ({label : v, value : v}))} />)
        }
        if(field.input_type === "text"){
        _field.input = (<Input readOnly type="text" />)
        }
        if(field.input_type === "number"){
        _field.input = (<Input readOnly type="number" min={0} />)
        }
        if(field.input_type === "date"){
        _field.input = (<DatePicker readOnly  />)
        }
      }

      if(!field.is_nested && !field.editable && field.computed_value){
        return null;
      }
  
      if(!field.is_nested && field.editable){
        if(field.input_type === "enum"){
          _field.input = (<Select options={field.values.map((v : any) => ({label : v, value : v}))} />)
        }
        if(field.input_type === "text"){
          _field.input = (<Input type="text" />)
        }
        if(field.input_type === "number"){
          _field.input = (<Input type="number" min={0} />)
        }
        if(field.input_type === "date"){
          _field.input = (<DatePicker  />)
        }
      }
      return _field;
    })
}

const cleanData = (data, fields) => {
    const flatFields = flattenFields(fields);
    // return data.map(d)
}

const DataEntry  = ({config} : {config:any}) => {
    const [addRecord, setAddRecord] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [gridKey, setGridKey] = useState<string>(`grid-key-${Math.random()}`);

    const [rowData, setRowData] = useState([]);
    
    

    const handleOnRowValueChanged = async (d, _id) => {
        try {
            const data = d.data;
            const flatFields = flattenFields(config.fields);
            flatFields.filter(field => !field.editable && field.computed_value).forEach(field => {
                if(field.computed_value_type === "sum"){
                    data[field.identifier] = _.sum(field.computed_values.map((v : any) => parseInt(data[v])));
                }
            });
            await reportDataUpdate(data, _id);
            messageApi.success("Data successfully updated.");
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        } finally {
            setRefresh(!refresh);
        }
    }

    const handleDelete = async (id) => {
        try {
           await reportDataDelete(id);
           messageApi.success("Data successfully deleted.");
        } catch (error) {
            message.error(parseResError(error).msg) 
        } finally {
            setRefresh(!refresh)
        }
    }

    // const handlePaginationChange = (current, pageSize) => {
    //     setPage(current);
    //     setLimit(pageSize);
    //     if (pageSize !== limit) {
    //         setPage(1); // Reset to the first page when page size changes
    //     }
    // };

    const handleSubmit = async (d) => {
        // console.log(d)
        try {
            const data = {
                report_config_id : config._id,
                data : d
            }
            await reportDataCreate(data)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
            console.log(err)
        }
        setRefresh(!refresh)
    };

    const [colDefs, setColDefs] = useState<any[]>([]);
    const [genericFields, setGenericFields] = useState<GenericFormFieldV3[]>([]);
    
    const fetchData  = async () => {
        setLoading(true);
        try {
            const data = (await reportDataGetByQuery({report_config_id : config._id}, [])).data;
            setGridKey(`grid-key-${Math.random()}`);
            console.log("real data:" ,data.map(d => {
                return {
                    ...d.data,
                    _id : d._id
                }
            }));
            console.log("col defs", colDefs)
            setRowData(data.map(d => {
                return {
                    ...d.data,
                    _id : d._id
                }
            }));
        } catch (error) {
            message.error(parseResError(error).msg);    
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData()
        return () => {
            setRowData([]);
        }
    }, [refresh]);

    useEffect(() => {
        
        if(Object.keys(config).length > 0 && config.fields && config.fields.length > 0){
            setGenericFields(generateGenericFields(config.fields));
            console.log("generic fields v4 : ",generateGenericFields(config.fields));
            setColDefs([
                ...generateColDefs(config.fields),
                {
                    headerName: "Actions",
                    headerClass: "justify-center",
                    cellRenderer: (params) => {
                        return (
                            <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this row?" onConfirm={() => handleDelete(params.data._id)}>
                                <Button color="danger" variant="filled">Delete</Button>
                            </Popconfirm>
                        )
                    }
                }
            ]);
            fetchData();
            setGridKey(`grid-key-${Math.random()}`);
            // setRefresh(!refresh)
            console.log("dadd", rowData)
        } 


        return () => {
            setRowData([]);
        }
    }, [config]);

    useEffect(() => {
        // console.log("colDefs", colDefs)
    }, [colDefs]);

    useEffect(() => {
        // console.log("dadd", rowData)
    }, [rowData]);


    return (
        <>
            {contextHolder}
            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 500 }} // the Data Grid will fill the size of the parent container
                >
                <Flex justify="end" className="mb-2">
                    <Button onClick={() => setAddRecord(true)} color="primary" variant="solid">Add Data</Button>
                    <Button onClick={() => setRefresh(!refresh)} variant="text" color="primary"><FontAwesomeIcon icon={faArrowsRotate} /></Button>
                </Flex>
                <AgGridReact
                    key={gridKey}
                    pagination
                    loading={loading}
                    editType={'fullRow'}
                    rowData={rowData}
                    columnDefs={colDefs}
                    onRowValueChanged={(d : any) => handleOnRowValueChanged(d, d.data._id)}
                />
            </div>

            <GenericFormDrawer
            config={config}
            visible={addRecord} 
            fields={genericFields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />

            
        </>
    )
}


export default DataEntry;

