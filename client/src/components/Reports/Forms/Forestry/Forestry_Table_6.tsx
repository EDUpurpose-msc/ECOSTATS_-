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
import cities from "philippines/cities.json"

export const forestry_6_gen_form_fields : GenericFormFieldV3[] = [
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
            <Input type="text" readOnly />
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
        name : "organization_name",
        label : "Name of People's Organization", 
        input : (
            <Input type="text"  />
        ),
        type : "input"
    },
    {
        name : "area",
        label : "Area (in ha)", 
        input : (
            <Input type="text"  />
        ),
        type : "input"
    },
    {
        name : "beneficiaries.male",
        label : "Male Beneficiaries", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "beneficiaries.female",
        label : "Female Beneficiaries", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "carp",
        label : "CARP(Yes/No)", 
        input : (
            <Select options={[
                {
                    value : "Yes",
                    label : "Yes"
                },
                {
                    value : "No",
                    label : "No"
                },
            ]} />
        ),
        type : "input"
    },
];

export const forestry_6_col_defs  = [
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
        cellEditor : "agSelectCellEditor",
        cellEditorParams : {
            values : ["Boac", "Mogpog", "Gasan", "Sta. Cruz", "Torrijos", "Buenavista"]
        }
    },
    { 
        headerName: "Name of People's Organization", 
        field: "organization_name", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Area (in ha)", 
        field: "area", 
        editable : true, 
        type: "numberColumn",
    },
    { 
        headerName: "Beneficiaries",
        children : [
            { 
                headerName: "Total", 
                field: "beneficiaries.total", 
                editable : true, 
                type: "numberColumn",
            },
            { 
                headerName: "Male", 
                field: "beneficiaries.male", 
                editable : true, 
                type: "numberColumn",
            },
            { 
                headerName: "Female", 
                field: "beneficiaries.female", 
                editable : true, 
                type: "numberColumn",
            },
        ] 
    },
    { 
        headerName: "CARP (Yes/No)", 
        field: "carp", 
        editable : true, 
        cellEditor : "agSelectCellEditor",
        cellEditorParams : {
            values : ["Yes", "No"]
        }
    },
];

const Forestry_Table_6  = () => {

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
        ...forestry_6_col_defs,
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
        d.data.beneficiaries.total = d.data.beneficiaries.male + d.data.beneficiaries.female;
        formUpdate(d.data, FormEnum.FORESTRY_6, Sector.FORESTRY)
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
        formDelete(id, FormEnum.FORESTRY_6, Sector.FORESTRY)
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
        d["beneficiaries.total"] = parseInt(d["beneficiaries.male"]) + parseInt(d["beneficiaries.female"]);
        try {
            await formCreate(d, FormEnum.FORESTRY_6, Sector.FORESTRY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        console.log(cities)
        setLoading(true)
        formGet(FormEnum.FORESTRY_6, Sector.FORESTRY, limit, page)
        .then(res => {
            console.log(res.data)
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
                val.proclamation_date = new Date(val.proclamation_date);
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
            fields={forestry_6_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Forestry_Table_6;