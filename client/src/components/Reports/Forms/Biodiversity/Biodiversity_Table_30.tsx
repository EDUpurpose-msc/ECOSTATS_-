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

export const biodiversity_30_gen_form_fields : GenericFormFieldV3[] = [
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
        name : "classification",
        label : "Classification", 
        input : (
            <Select options={[
                {
                    label : "Mammal",
                    value : "Mammal"
                },
                {
                    label : "Avian",
                    value : "Avian"
                },
                {
                    label : "Reptile",
                    value : "Reptile"
                },
                {
                    label : "Others",
                    value : "Others"
                },
            ]} />
        ),
        type : "input"
    },
    {
        name : "no_of_heads",
        label : "No. of Heads", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "Mode of Acquisition",
        label : "Mode of Acquisition", 
        type : "title"
    },
    {
        name : "mode_of_acquisition.heads_confiscated",
        label : "No. of Heads Confiscated", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mode_of_acquisition.heads_donated",
        label : "No. of Heads Donated / Turned over", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mode_of_acquisition.heads_rescued",
        label : "No. of Heads Rescued/ Retrieved", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mortality",
        label : "Mortality", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "Mode of Disposition",
        label : "Mode of Disposition", 
        type : "title"
    },
    {
        name : "mode_of_disposition.heads_donated",
        label : "No. of Heads Donated", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mode_of_disposition.heads_loaned",
        label : "No. of Heads Loaned", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mode_of_disposition.heads_turned_over",
        label : "No. of Heads Turned Over", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "mode_of_disposition.heads_released",
        label : "No. of Heads Released", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },

];

export const biodiversity_30_col_defs = [
    {
        headerName : "CY",
        field : "calendar_year",
        type : "numberColumn",
        editable : true
    },
    { 
        headerName: "Classification", 
        field: "classification", 
        editable : true, 
        cellEditor : "agSelectCellEditor",
        cellEditorParams : {
            values : ["Mammal", "Avian", "Reptile" , "Others"],
        }
    },
    { 
        headerName: "No. of Heads", 
        field: "no_of_heads", 
        editable : true, 
        type : "numberColumn"
    },
    { 
        headerName: "Mode of Acquisition", 
        children : [
            {
                headerName : "No. of Heads Confiscated",
                field : "mode_of_acquisition.heads_confiscated",
                editable : true,
                type : "numberColumn"
            },
            {
                headerName : "No. of Heads Donated / Turned over",
                field : "mode_of_acquisition.heads_donated",
                editable : true,
                type : "numberColumn"
            },
            {
                headerName : "No. of Heads Rescued/ Retrieved",
                field : "mode_of_acquisition.heads_rescued",
                editable : true,
                type : "numberColumn"
            },
        ]
    },
    {
        headerName : "Mortality",
        field : "mortality",
        editable : true,
        type : "numberColumn"
    },
    { 
        headerName: "Mode of Disposition", 
        children : [
            {
                headerName : "No. of Heads Donated",
                field : "mode_of_disposition.heads_donated",
                editable : true,
                type : "numberColumn"
            },
            {
                headerName : "No. of Heads Loaned",
                field : "mode_of_disposition.heads_loaned",
                editable : true,
                type : "numberColumn"
            },
            {
                headerName : "No. of Heads Turned Over",
                field : "mode_of_disposition.heads_turned_over",
                editable : true,
                type : "numberColumn"
            },
            {
                headerName : "No. of Heads Released",
                field : "mode_of_disposition.heads_released",
                editable : true,
                type : "numberColumn"
            },
        ]
    },
];

const Biodiversity_Table_30  = () => {
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
        ...biodiversity_30_col_defs,
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
        formUpdate(d.data, FormEnum.BIODIVERSITY_30, Sector.BIODIVERSITY)
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
        formDelete(id, FormEnum.BIODIVERSITY_30, Sector.BIODIVERSITY)
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
            await formCreate(d, FormEnum.BIODIVERSITY_30, Sector.BIODIVERSITY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        } finally {
            setRefresh(!refresh);
        }
    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.BIODIVERSITY_30, Sector.BIODIVERSITY, limit, page)
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
            fields={biodiversity_30_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Biodiversity_Table_30;