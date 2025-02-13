import { useEffect, useState } from "react";
import { parseResError } from "../../../../services/errorHandler";
import { formCreate, formDelete, formGet, formUpdate } from "../../../../services/api/formsApi";
import { FormEnum, Sector } from "../../../../types/forms/formNameEnum";
import { Button, Checkbox, DatePicker, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import GenericFormDrawerV3 from "../../../GenericFormV3";
import { GenericFormFieldV3 } from "../../../../types/forms/GenericFormTypes";
import { municipalityOptions } from "../../../../services/helper";

export const land_1_gen_form_fields : GenericFormFieldV3[] = [
    {
        name : "calendar_year",
        label : "Calendar Year", 
        input : <Input type="Number" />,
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
            <Select showSearch virtual options={municipalityOptions} />
        ),
        type : "input",
        notDefault : true
    },
    {
        name : "contested_area",
        label : "Contested Area (ha)",
        input : <Input type="number" />,
        type : "input"

    },
    {
        name : "uncontested_area",
        label : "Uncontested Area (ha)",
        input : <Input type="number" />,
        type : "input"
    },
];

// Column Definitions: Defines the columns to be displayed.
export const land_1_col_defs : any[] = [
    { 
        headerName: "Calendar year", 
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
        headerClass: "justify-center", 
        field: "municipality",  
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Contested Area (ha)", 
        field: "uncontested_area", 
        editable : true, 
        type: "numberColumn" 

    },
    { 
        headerName: " Uncontested Area (ha)", 
        field: "contested_area", 
        editable : true, 
        type: "numberColumn" 

    }
];

const Land_Table_1  = () => {
    const [page, setPage] = useState(1);
    const [addRecord, setAddRecord] = useState(false);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);
    
    

    const handleOnRowValueChanged = (d) => {
        formUpdate(d.data, FormEnum.LAND_1, Sector.LAND)
        .then(res => {
            messageApi.success("Data successfully updated.");
        })
        .catch(err => {
            console.log(err)
            setRefresh(!refresh)
        })
        .finally();
    }

    const handleDelete = (id) => {
        formDelete(id, FormEnum.LAND_1, Sector.LAND)
        .then(res => {
            messageApi.success("Data successfully deleted.");
        })
        .catch(err => {
            console.log(err)
            
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
            await formCreate(d, FormEnum.LAND_1, Sector.LAND)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
            console.log(err)
        }
        setRefresh(!refresh)
    };

    const [colDefs, setColDefs] = useState<any[]>([
        ...land_1_col_defs,
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
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.LAND_1, Sector.LAND, limit, page)
        .then(res => {
            console.log(res)
            setTotal(res.data.total)
            setRowData(res.data.models);
        })
        .catch(err => {
            console.log(err);
            messageApi.error(parseResError(err).msg);
        })
        .finally(() => setLoading(false));
    }, [page, refresh, limit]);

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

            <GenericFormDrawerV3
            visible={addRecord} 
            fields={land_1_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />

            
        </>
    )
}


export default Land_Table_1;

