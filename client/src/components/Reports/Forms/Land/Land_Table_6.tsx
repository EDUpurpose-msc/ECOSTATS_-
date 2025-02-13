import { useEffect, useState } from "react";
import { parseResError } from "../../../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { Button, Checkbox, DatePicker, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { GenericFormField, GenericFormFieldV3 } from "../../../../types/forms/GenericFormTypes";
import GenericFormDrawer from "../../../GenericFormV3";
import { generateYearOptions, municipalityOptions } from "../../../../services/helper";
import CellDateEditor from "../../../CellDateEditor";
import { ValueFormatterParams } from "ag-grid-community";

export const land_6_gen_form_fields : GenericFormFieldV3[] = [
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
        name : "name_of_patentee",
        label : "Name of Patentee", 
        input : <Input type="text" />,
        type : "input"
    },
    {
        name : "area_in_ha",
        label : "Area (ha)", 
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "location_title",
        label : "Location",
        type : "title"
    },
    {
        name : "location.barangay",
        label : "Barangay", 
        input : <Input type="text" />,
        type : "input"
    },
    {
        name : "location.municipality",
        label : "Municipality", 
        input : <Select showSearch virtual options={municipalityOptions}  />,
        type : "input"
    },
    {
        name : "date_transmitted_to_rod",
        label : "Date Transmitted to RoD", 
        input : <DatePicker type="number" className="w-full" />,
        type : "input"
    },
    {
        name : "government_sites_housing_project_endorsement",
        label : "Government Sites/Housing Project endorsed to Central Office for Issuance of Proclamation/Special Patent",
        type : "title"
    },
    {
        name : "government_sites_housing_project_endorsement.school_site",
        label : "School Site", 
        // input : <Checkbox />,
        type : "checkbox"
    },
    {
        name : "government_sites_housing_project_endorsement.lgu_government_site",
        label : "Government Site", 
        // input : <Checkbox />,
        type : "checkbox"
    },
];

export const land_6_col_defs = [
    { 
        headerName: "CY (Calendar Year)", 
        field: "calendar_year", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Name of Patentee", 
        field: "name_of_patentee", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Area (ha)", 
        field: "area_in_ha", 
        editable : true, 
        type: "numberColumn",
    },
    { 
        headerName: "Location", 
        children : [
            { 
                headerName: "Barangay", 
                field: "location.barangay", 
                editable : true, 
                type: "textColumn",
            },
            { 
                headerName: "Municipality", 
                field: "location.municipality", 
                editable : true, 
                type: "textColumn",
            },
        ]
    },
    { 
        headerName: "Date Transmitted to RoD", 
        field: "date_transmitted_to_rod", 
        editable : true, 
        valueFormatter: (params) => {
            const date = new Date(params.value);
            return date.toLocaleDateString(); // Display in a user-friendly format
        },
        cellEditor: "agDateCellEditor",
        valueParser: (params) => {
            console.log(params)
            return new Date(params.newValue).toISOString(); // Save in ISO format
        },
    },
    { 
        headerName: "Government Sites/Housing Project endorsed to Central Office for Issuance of Proclamation/Special Patent", 
        children : [
            { 
                headerName: "School Site", 
                field: "government_sites_housing_project_endorsement.school_site", 
                editable : true, 
                type: "textColumn",
            },
            { 
                headerName: "LGU Government Site", 
                field: "government_sites_housing_project_endorsement.lgu_government_site", 
                editable : true, 
                type: "textColumn",
            },
        ]
    },
]

const Land_Table_6  = () => {

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
        ...land_6_col_defs,
        {
            headerName: "Actions",
            cellRenderer: (params) => {
                return (
                    <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this row?" onConfirm={() => handleDelete(params.data._id)}>
                        <Button color="danger" variant="filled">Delete</Button>
                    </Popconfirm>
                )
            }
        },
    ]);

    

    const handleOnRowValueChanged = (d) => {
        formUpdate(d.data, FormEnum.LAND_6, Sector.LAND)
        .then(res => {
            messageApi.success("Data successfully updated.");
        })
        .catch(err => {
            console.log(err)
            setRefresh(!refresh)
            messageApi.error(parseResError(err).msg)
        })
        .finally();
    }

    const handleDelete = (id) => {
        formDelete(id, FormEnum.LAND_6, Sector.LAND)
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
        console.log(d)
        try {
            await formCreate(d, FormEnum.LAND_6, Sector.LAND)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.LAND_6, Sector.LAND, limit, page)
        .then(res => {
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
                val.date_transmitted_to_rod = new Date(val.date_transmitted_to_rod);
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
            fields={land_6_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}


export default Land_Table_6;