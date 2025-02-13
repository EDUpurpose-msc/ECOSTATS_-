import { useEffect, useState } from "react";
import { parseResError } from "../../../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { Button, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { GenericFormField, GenericFormFieldV3 } from "../../../../types/forms/GenericFormTypes";
import GenericFormDrawer from "../../../GenericFormV3";
import { generateYearOptions, municipalityOptions } from "../../../../services/helper";

export const land_7_gen_form_fields : GenericFormFieldV3[] = [
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
        name : "no_of_transmitted_to_rod",
        label : "No of Transmitted to RoD", 
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "title_1",
        label : "Foreshore Lease Agreements Issued", 
        type : "title"
    },
    {
        name : "no_of_lots",
        label : "No. of Lots", 
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "total_land_area_ha",
        label : "Total Land Area (ha)", 
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "total_forecasted_annual_revenue",
        label : "Total Forecasted Annual Revenue (Php)", 
        input : <Input type="number" />,
        type : "input"
    },
    
];

export const land_7_col_defs = [
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
        headerName: "Foreshore Lease Agreements Issued", 
        children : [
            { 
                headerName: "No. of Lots", 
                field: "no_of_lots", 
                editable : true, 
                type: "numberColumn",
            },
            { 
                headerName: "Total Land Area (ha)", 
                field: "total_land_area_ha", 
                editable : true, 
                type: "numberColumn",
            },
            { 
                headerName: "Total Forecasted Annual Revenue (Php)", 
                field: "total_forecasted_annual_revenue", 
                editable : true, 
                type: "numberColumn",
            },
        ]
    },
];

const Land_Table_7  = () => {

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
        ...land_7_col_defs,
        
        {
            headerName: "Actions",
            cellRenderer: (params) => {
                return (
                    <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this row?" onConfirm={() => handleDelete(params.data._id)}>
                        <Button color="danger" variant="filled">Delete</Button>
                    </Popconfirm>
                )
            }
        }
    ]);

    

    const handleOnRowValueChanged = (d) => {
        d.data.total_beneficiaries = d.data.male_beneficiaries + d.data.female_beneficiaries;
        console.log(d)
        formUpdate(d.data, FormEnum.LAND_7, Sector.LAND)
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
        formDelete(id, FormEnum.LAND_7, Sector.LAND)
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
            d.total_beneficiaries = parseInt(d.male_beneficiaries) + parseInt(d.female_beneficiaries);
            await formCreate(d, FormEnum.LAND_7, Sector.LAND)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.LAND_7, Sector.LAND, limit, page)
        .then(res => {
            console.log(res.data)
            setTotal(res.data.total)
            setRowData(res.data.models);
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
            fields={land_7_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}


export default Land_Table_7;