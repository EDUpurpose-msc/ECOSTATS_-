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
import province from "philippines/provinces.json"
import TextArea from "antd/es/input/TextArea";

export const biodiversity_6_gen_form_fields : GenericFormFieldV3[] = [
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
        name : "date_established",
        label : "Date Established", 
        input : (
            <Select 
            showSearch 
            allowClear
            options={generateYearOptions(1800, new Date().getFullYear())}
            />
        ),
        type : "input",
        required : false
    },
    {
        name : "date_rehabilitated",
        label : "Date Rehabilitated", 
        input : (
            <Select 
            showSearch 
            allowClear
            options={generateYearOptions(1800, new Date().getFullYear())}
            />
        ),
        type : "input"
    },
    {
        name : "rehabilitated_area",
        label : "Rehabilitated Area", 
        input : (
            <Input type="number" />
        ),
        type : "input"
    },
    {
        name : "species_identified",
        label : "Species Identified", 
        input : (
            <TextArea  />
        ),
        type : "input"
    },
    {
        name : "fund_source",
        label : "Fund Source", 
        input : (
            <Input type="string" />
        ),
        type : "input"
    },
];

export const biodiversity_6_col_defs = [
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
        headerName: "Rehabilitated Area", 
        field: "rehabilitated_area", 
        editable : true, 
        type: "numberColumn",
    },
    { 
        headerName: "Date Established", 
        field: "date_established", 
        editable : true, 
        type : "numberColumn",
        valueFormatter: (params) => {
            return params.value ? params.value : "Naturally Grown"
        },
    },
    { 
        headerName: "Date Rehabilated", 
        field: "date_rehabilitated", 
        editable : true, 
        type : "numberColumn"
    },
    { 
        headerName: "Species Identified", 
        field: "species_identified", 
        editable : true, 
        type: "textColumn",
    },
    { 
        headerName: "Fund Source", 
        field: "fund_source", 
        editable : true, 
        type: "textColumn",
    },

];

const Biodiversity_Table_6  = () => {

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
        ...biodiversity_6_col_defs,
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

    // const genericFormFields : GenericFormFieldV3[] = [
    //     {
    //         name : "calendar_year",
    //         label : "Calendar Year", 
    //         input : (
    //             <Select 
    //             showSearch 
    //             options={generateYearOptions(2000, new Date().getFullYear())}
    //             />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "province",
    //         label : "Province", 
    //         input : (
    //             <Select showSearch virtual options={province.map(val => {
    //                 return {
    //                     value: val.name,
    //                     label : val.name
    //                 }
    //             })}  />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "municipality",
    //         label : "Municipality", 
    //         input : (
    //             <Select showSearch virtual options={cities.map(val => {
    //                 return {
    //                     value: val.name,
    //                     label : val.name
    //                 }
    //             })}  />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "date_established",
    //         label : "Date Established", 
    //         input : (
    //             <Select 
    //             showSearch 
    //             allowClear
    //             options={generateYearOptions(1800, new Date().getFullYear())}
    //             />
    //         ),
    //         type : "input",
    //         required : false
    //     },
    //     {
    //         name : "date_rehabilitated",
    //         label : "Date Rehabilitated", 
    //         input : (
    //             <Select 
    //             showSearch 
    //             allowClear
    //             options={generateYearOptions(1800, new Date().getFullYear())}
    //             />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "rehabilitated_area",
    //         label : "Rehabilitated Area", 
    //         input : (
    //             <Input type="number" />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "species_identified",
    //         label : "Species Identified", 
    //         input : (
    //             <TextArea  />
    //         ),
    //         type : "input"
    //     },
    //     {
    //         name : "fund_source",
    //         label : "Fund Source", 
    //         input : (
    //             <Input type="string" />
    //         ),
    //         type : "input"
    //     },
    // ];

    const handleOnRowValueChanged = (d) => {
        d.data.total_beneficiaries = d.data.male_beneficiaries + d.data.female_beneficiaries;
        console.log(d)
        formUpdate(d.data, FormEnum.BIODIVERSITY_6, Sector.BIODIVERSITY)
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
        formDelete(id, FormEnum.BIODIVERSITY_6, Sector.BIODIVERSITY)
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
            await formCreate(d, FormEnum.BIODIVERSITY_6, Sector.BIODIVERSITY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        console.log(cities)
        setLoading(true)
        formGet(FormEnum.BIODIVERSITY_6, Sector.BIODIVERSITY, limit, page)
        .then(res => {
            console.log(res.data)
            setTotal(res.data.total)
            setRowData(res.data.models.map(val => {
                val.date_of_assessment = new Date(val.date_of_assessment);
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
            fields={biodiversity_6_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}

export default Biodiversity_Table_6;