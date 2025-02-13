import { useEffect, useState } from "react";
import { parseResError } from "../../../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { Button, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import GenericFormDrawer from "../../../GenericFormV3";
import { GenericFormField, GenericFormFieldV3 } from "../../../../types/forms/GenericFormTypes";
import { municipalityOptions } from "../../../../services/helper";

export const land_2_col_defs = [
    { 
        headerName: "CY", 
        headerClass: "justify-center", 
        field: "calendar_year", 
        editable : true, 
        type: "numberColumn",
    },
    { 
        headerName: "Province", 
        headerClass: "justify-center", 
        field: "province", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Municipality", 
        field: "municipality", 
        editable : true, 
        type: "textColumn",
        headerClass: "justify-center" 

    },
    { 
        headerName: "No. of Lots", 
        field: "no_of_lots", 
        editable : true, 
        type: "textColumn",

    },
    { 
        headerName: "Total Land Area", 
        field: "total_land_area", 
        editable : true, 
        type: "textColumn",
    },
    {
        headerName: "Income (Php)", 
        children : [
            { 
                headerName: "Sale", 
                field: "sale", 
                editable : true, 
                type: "numberColumn" 
    
            },
            { 
                headerName: "Lease", 
                field: "lease", 
                editable : true, 
                type: "numberColumn" 
    
            },
        ]
    },
];

export const land_2_gen_form_fields : GenericFormFieldV3[] = [
    {
        name : "calendar_year",
        label : "CY", 
        input : <Input type="number" />,
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
        label : "City/Municipality",
        input : (
            <Select showSearch virtual options={municipalityOptions}  />
        ),
        type : "input"
    },
    {
        name : "no_of_lots",
        label : "No. of Lots",
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "total_land_area",
        label : "Total Land Area",
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "sale",
        label : "Sale",
        input : <Input type="number" />,
        type : "input"
    },
    {
        name : "lease",
        label : "Lease",
        input : <Input type="number" />,
        type : "input"
    },
];


const Land_Table_2  = () => {

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
        ...land_2_col_defs,
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

    

    const handleOnRowValueChanged = (d) => {
        formUpdate(d.data, FormEnum.LAND_2, Sector.LAND)
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
        formDelete(id, FormEnum.LAND_2, Sector.LAND)
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
            await formCreate(d, FormEnum.LAND_2, Sector.LAND)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.LAND_2, Sector.LAND, limit, page)
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
            fields={land_2_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}


export default Land_Table_2;