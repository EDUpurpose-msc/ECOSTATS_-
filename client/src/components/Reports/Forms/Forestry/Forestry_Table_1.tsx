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
import _ from "lodash"

export const forestry_1_gen_form_fields : GenericFormFieldV3[] = [
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
            <Select  showSearch virtual options={municipalityOptions}  />
        ),
        type : "input",
        notDefault : true
    },
    // {
    //     name : "total_land_area",
    //     label : "Total Land Area", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "certified_a_n_d",
        label : "Certified A&D", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "title_2",
        label : "Forestland", 
        type : "title"
    },
    // {
    //     name : "forestland.total_forestland",
    //     label : "Total Forestland", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "forestland.unclassified_forestland_ha",
        label : "Unclassified Forestland", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    // {
    //     name : "forestland.classified_forestland.total_classified_forestland",
    //     label : "Total Classified Forest Land", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "forestland.classified_forestland.established_forest_reserves",
        label : "Established Forest Reserves", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "forestland.classified_forestland.established_timberland",
        label : "Established Timberland", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "forestland.classified_forestland.national_parks_and_grbs_wa",
        label : "National Parks and GRBS/ WA", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "forestland.classified_forestland.military_and_naval_reservations",
        label : "Military and Naval Reservations", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "forestland.classified_forestland.civil_registration",
        label : "Civil Registration", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },
    {
        name : "forestland.classified_forestland.fishpond",
        label : "Fishpond", 
        input : (
            <Input type="number"  />
        ),
        type : "input"
    },

];

export const forestry_1_col_defs = [
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
        headerName: "Total Land Area", 
        field: "total_land_area", 
        editable : false, 
        type: "numberColumn",
    },
    { 
        headerName: "Certified A&D", 
        field: "certified_a_n_d", 
        editable : true, 
        type: "numberColumn",
    },
    {
        headerName : "ForestLand",
        children : [
            { 
                headerName: "Total Forestland", 
                field: "forestland.total_forestland", 
                editable : false, 
                type: "numberColumn",
            },
            { 
                headerName: "Unclassified Forestland", 
                field: "forestland.unclassified_forestland_ha", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Classified ForestLand",
                children : [
                    { 
                        headerName: "Total Classified Forestland", 
                        field: "forestland.classified_forestland.total_classified_forestland", 
                        editable : false, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "Established Forest Reserves", 
                        field: "forestland.classified_forestland.established_forest_reserves", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "Established Timberlands", 
                        field: "forestland.classified_forestland.established_timberland", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "National Parks and GRBS/ WA", 
                        field: "forestland.classified_forestland.national_parks_and_grbs_wa", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "Military and Naval Reservations", 
                        field: "forestland.classified_forestland.military_and_naval_reservations", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "Civil Registration", 
                        field: "forestland.classified_forestland.civil_registration", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                    { 
                        headerName: "Fishpond", 
                        field: "forestland.classified_forestland.fishpond", 
                        editable : true, 
                        type: "numberColumn",
                    }, 
                ]
            }
        ]
    },
]

const Forestry_Table_1  = () => {

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
        ...forestry_1_col_defs,
        {
            headerName: "Actions",
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
        // d.data.total_beneficiaries = d.data.male_beneficiaries + d.data.female_beneficiaries;
        // console.log(d)
        d.data.forestland.classified_forestland.total_classified_forestland = _.sum([
            d.data.forestland.classified_forestland.established_forest_reserves,
            d.data.forestland.classified_forestland.established_timberland,
            d.data.forestland.classified_forestland.national_parks_and_grbs_wa,
            d.data.forestland.classified_forestland.military_and_naval_reservations,
            d.data.forestland.classified_forestland.civil_registration,
            d.data.forestland.classified_forestland.fishpond,
        ]);
        d.data.forestland.total_forestland = d.data.forestland.classified_forestland.total_classified_forestland + d.data.forestland.unclassified_forestland_ha;
        d.data.total_land_area = d.data.forestland.total_forestland + d.data.certified_a_n_d;
        console.log(d.data)
        formUpdate(d.data, FormEnum.FORESTRY_1, Sector.FORESTRY)
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
        formDelete(id, FormEnum.FORESTRY_1, Sector.FORESTRY)
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
        d["forestland.classified_forestland.total_classified_forestland"] = _.sum([
            parseInt(d["forestland.classified_forestland.established_forest_reserves"]),
            parseInt(d["forestland.classified_forestland.established_timberland"]),
            parseInt(d["forestland.classified_forestland.national_parks_and_grbs_wa"]),
            parseInt(d["forestland.classified_forestland.military_and_naval_reservations"]),
            parseInt(d["forestland.classified_forestland.civil_registration"]),
            parseInt(d["forestland.classified_forestland.fishpond"]),
        ]);
        d["forestland.total_forestland"] = parseInt(d["forestland.classified_forestland.total_classified_forestland"]) + parseInt(d["forestland.unclassified_forestland_ha"]);
        d["total_land_area"] = parseInt(d["forestland.total_forestland"]) + parseInt(d["certified_a_n_d"]);
        try {
            await formCreate(d, FormEnum.FORESTRY_1, Sector.FORESTRY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.FORESTRY_1, Sector.FORESTRY, limit, page)
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
            fields={forestry_1_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}


export default Forestry_Table_1;