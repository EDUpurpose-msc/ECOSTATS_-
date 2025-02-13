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
import { ValueFormatterParams } from "ag-grid-community";
import CellDateEditor from "../../../CellDateEditor";

export const biodiversity_32_gen_form_fields : GenericFormFieldV3[] = [
    {
        name : "calendar_year",
        label : "Calendar Year", 
        input : (
            <Select options={generateYearOptions(2000, new Date().getFullYear())}/>
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
            <Select options={municipalityOptions} />
        ),
        type : "input"
    },
    {
        name : "species",
        label : "Species", 
        input : (
            <Input type="text" />
        ),
        type : "input"
    },
    {
        name : "date_encountered",
        label : "Date Encountered / Tagged", 
        input : (
            <DatePicker  />
        ),
        type : "input"
    },
    {
        name : "tag_no",
        label : "Tag No.", 
        input : (
            <Input type="text" />
        ),
        type : "input"
    },
    {
        name : "tagging",
        label : "Tagging", 
        input : (
            <Input type="text" />
        ),
        type : "input"
    },
    {
        name : "date_released",
        label : "Date Released", 
        input : (
            <DatePicker  />
        ),
        type : "input"
    },
   

];

export const biodiversity_32_col_defs = [
    {
        headerName : "CY",
        field : "calendar_year",
        type : "numberColumn",
        editable : true
    },
    { 
        headerName: "Province", 
        field: "province", 
        editable : true, 
        type : "textColumn"
    },
    {
        headerName : "Municipality",
        field : "municipality",
        editable : true,
        cellEditor : "agSelectCellEditor",
        cellEditorParams : {
            values : ["Gasan", "Boac", "Mogpog", "Sta. Cruz", "Torrijos", "Buenavista"]
        }
    },
    {
        headerName : "Species",
        field : "species",
        editable : true,
        type : "textColumn"
    },
    {
        headerName : "Date Encountered/Tagged",
        field : "date_encountered",
        editable : true,
        valueFormatter: (params) => {
            // val.date_established = new Date(val.date_established);
            const date = new Date(params.value);
            console.log(date.toLocaleDateString())
            return date.toLocaleDateString(); // Display in a user-friendly format
        },
        cellEditor: "agDateCellEditor",
        valueParser: (params) => {
            console.log(params)
            return new Date(params.newValue).toISOString(); // Save in ISO format
        },
    },
    {
        headerName : "Tag No.",
        field : "tag_no",
        editable : true,
        type : "textColumn"
    },
    {
        headerName : "Tagging",
        field : "tagging",
        editable : true,
        type : "textColumn"
    },
    {
        headerName : "Date Released",
        field : "date_released",
        editable : true,
        valueFormatter: (params) => {
            // val.date_established = new Date(val.date_established);
            const date = new Date(params.value);
            console.log(date.toLocaleDateString())
            return date.toLocaleDateString(); // Display in a user-friendly format
        },
        cellEditor: "agDateCellEditor",
        valueParser: (params) => {
            console.log(params)
            return new Date(params.newValue).toISOString(); // Save in ISO format
        },
    },
];

const Biodiversity_Table_32  = () => {
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
        ...biodiversity_32_col_defs,
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
        formUpdate(d.data, FormEnum.BIODIVERSITY_32, Sector.BIODIVERSITY)
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
        formDelete(id, FormEnum.BIODIVERSITY_32, Sector.BIODIVERSITY)
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
            await formCreate(d, FormEnum.BIODIVERSITY_32, Sector.BIODIVERSITY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        } finally {
            setRefresh(!refresh);
        }
    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.BIODIVERSITY_32, Sector.BIODIVERSITY, limit, page)
        .then(res => {
            console.log(res.data)
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
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
            fields={biodiversity_32_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Biodiversity_Table_32;