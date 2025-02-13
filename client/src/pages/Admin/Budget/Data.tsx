import { AgGridReact } from "ag-grid-react";
import { Button, Flex, Input, message, Pagination, Popconfirm, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import GenericFormDrawer from "../../../components/GenericFormV3";
import { GenericFormFieldV3 } from "../../../types/forms/GenericFormTypes";
import { generateYearOptions, municipalityOptions } from "../../../services/helper";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { budgetCreate, budgetDelete, budgetGet, budgetUpdate } from "../../../services/api/budgetApi";
import { parseResError } from "../../../services/errorHandler";
import numeral from "numeral"
import { header } from "case";

export const budget_gen_form_fields : GenericFormFieldV3[] = [
    {
        name : "calendar_year",
        label : "Calendar Year", 
        input : (
            <Select 
            showSearch 
            options={generateYearOptions(2000, new Date().getFullYear())}
            />
        ),
        type : "input"
    },
    {
        name : "land",
        label : "Land Sector", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "land_manpower",
        label : "Land Sector Manpower", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "biodiversity",
        label : "Biodiversity Sector", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "biodiversity_manpower",
        label : "Biodiversity Sector Manpower", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "forestry",
        label : "Forestry Sector", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    },
    {
        name : "forestry_manpower",
        label : "Forestry Sector Manpower", 
        input : (
            <Input type="number" min={0}/>
        ),
        type : "input"
    }
];

export const budget_col_defs = [
    { 
        headerName: "Year", 
        field: "calendar_year", 
        editable : true, 
        type: "numberColumn",
    },
    {
        headerName: "Land Sector",
        children : [
            { 
                headerName: "Budget", 
                field: "land", 
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0.00")
                }
            },
            { 
                headerName: "Manpower", 
                field: "land_manpower", 
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0")
                }
            },
        ]
    },
    {
        headerName: "Biodiversity Sector",
        children : [
            { 
                headerName: "Budget", 
                field: "biodiversity", 
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0.00")
                } 
            },
            {
                headerName: "Manpower",
                field : "biodiversity_manpower",
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0")
                }
            }
        ]
    },
    {
        headerName: "Forestry Sector",
        children : [
            { 
                headerName: "Budget", 
                field: "forestry", 
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0.00")
                }
            },
            {
                headerName: "Manpower",
                field : "forestry_manpower",
                editable : true, 
                type: "numberColumn",
                valueFormatter : (data) => {
                    return numeral(data.value).format("0,0")
                }
            }
        ]
    },
    { 
        headerName: "Total Budget", 
        field: "total", 
        editable : true, 
        type: "numberColumn",
        valueFormatter : (data) => {
            return numeral(data.value).format("0,0.00")
        }
    },
];


const Data = () => {
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
        ...budget_col_defs,
 
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
        d.data.total = _.sum([d.data.land, d.data.biodiversity, d.data.forestry]);
        console.log(d)
        budgetUpdate(d.data)
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
        console.log(id)
        budgetDelete(id)
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
        d.total = _.sum([parseInt(d.land), parseInt(d.biodiversity), parseInt(d.forestry)])
        try {
            await budgetCreate(d)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        budgetGet(limit, page)
        .then(res => {
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
                return val;
            }));
            console.log(rowData)
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
            <Title level={4}>Budget Data</Title>
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
            fields={budget_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Data;