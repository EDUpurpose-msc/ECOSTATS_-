import { useEffect, useState } from "react";
import { parseResError } from "../../../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { Button, DatePicker, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { GenericFormFieldV3 } from "../../../../types/forms/GenericFormTypes";
import GenericFormDrawer from "../../../GenericFormV3";
import { generateYearOptions, municipalityOptions } from "../../../../services/helper";
import _ from 'lodash';

export const biodiversity_10_gen_form_fields : GenericFormFieldV3[] = [
    {
        name : "calendar_year",
        label : "Calendar Year", 
        input : (
            <Select 
            showSearch 
            options={generateYearOptions(2000, new Date().getFullYear())}
            />
        ),
        type : "input",
        notDefault : true
    },
    {
        name : "province",
        label : "Province", 
        input : (
            <Input type="text" readOnly  />
        ),
        type : "input",
        initialValue : "Marinduque"
    },
    {
        name : "municipality",
        label : "Municipality", 
        input : (
            <Select showSearch virtual options={municipalityOptions}  />
        ),
        type : "input"
    },
    {
        name : "name_of_critical_habitat",
        label : "Name of Critical Habitat", 
        input : (
            <Input type="text" />
        ),
        type : "input"
    },
    {
        name : "legal_instrument",
        label : "Legal Instrument", 
        input : (
            <Input type="text" />
        ),
        type : "input",
        required : false
    },
    {
        name : "area",
        label : "Area (in ha)", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "threatened_species",
        label : "Threatened Species", 
        input : (
            <Input type="text" />
        ),
        type : "input"
    },
    {
        name : "remarks",
        label : "Remarks", 
        input : (
            <Input type="text" />
        ),
        type : "input",
        required : false
    },
];

export const biodiversity_10_col_defs = [
    { 
        headerName: "CY", 
        field: "calendar_year", 
        editable : true, 
        type: "numberColumn",
    },
    { 
        headerName: "Province", 
        field: "province", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Municipality", 
        field: "municipality", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Name of Critical habitat", 
        field: "name_of_critical_habitat", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Legal Instrument", 
        field: "legal_instrument", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Area (in ha)", 
        field: "area", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Threatened Species", 
        field: "threatened_species", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Remarks", 
        field: "remarks", 
        editable : true, 
        type : "textColumn"
    },
];

const Biodiversity_Table_10  = () => {
    const [page, setPage] = useState(1);
    const [addRecord, setAddRecord] = useState(false);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);
    
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<any>([
        ...biodiversity_10_col_defs,
        {
            headerName: "Actions",
            pinned:"right",
            cellRenderer: (params) => {
                return (
                    <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this row?" onConfirm={() => handleDelete(params.data._id)}>
                        <Button color="danger" variant="filled">Delete</Button>
                    </Popconfirm>
                );
            }
        }
    ]);

    const handleOnRowValueChanged = (d) => {
        formUpdate(d.data, FormEnum.BIODIVERSITY_10, Sector.BIODIVERSITY)
        .then(res => {
            messageApi.success("Data successfully updated.");
        })
        .catch(err => {
            console.log(err) 
            messageApi.error(parseResError(err).msg)
        })
        .finally(() => setRefresh(!refresh));
    }

    const handleDelete = (id) => {
        formDelete(id, FormEnum.BIODIVERSITY_10, Sector.BIODIVERSITY)
        .then(res => {
            messageApi.success("Data successfully deleted.");
        })
        .catch(err => {
            console.log(err)
            messageApi.error(parseResError(err).msg)
        })
        .finally(() => setRefresh(!refresh));
    }

    const handlePaginationChange = (current, pageSize) => {
        setPage(current);
        setLimit(pageSize);
        if (pageSize !== limit) {
            setPage(1); // Reset to the first page when page size changes
        }
    };

    const handleSubmit = async (d) => {
        try {
            await formCreate(d, FormEnum.BIODIVERSITY_10, Sector.BIODIVERSITY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        } finally {
            setRefresh(!refresh);
        }
    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.BIODIVERSITY_10, Sector.BIODIVERSITY, limit, page)
        .then(res => {
            console.log(res.data)
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
                val.date_established = new Date(val.date_established);
                return val;
            }));
        })
        .catch(err => {
            console.log(err);
            messageApi.error(parseResError(err).msg);
        })
        .finally(() => setLoading(false));
    }, [page, limit, refresh]);

    useEffect(() => {
        setPage(1)
    }, [refresh]);


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
                    gridOptions={{
                        defaultColDef: {
                            headerClass: "justify-center align-center text-center"
                        }
                    }}
                    loading={loading}
                    editType={'fullRow'}
                    rowData={rowData}
                    columnDefs={colDefs}
                    onRowValueChanged={handleOnRowValueChanged}
                />
                <Flex justify="center" className="mt-2">
                    <Pagination
                        current={page}
                        pageSize={limit}
                        total={total}
                        showSizeChanger
                        onChange={handlePaginationChange}
                        pageSizeOptions={['10', '20', '50', '100']}
                    />
                </Flex>
            </div>

            <GenericFormDrawer
            visible={addRecord} 
            fields={biodiversity_10_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Biodiversity_Table_10;