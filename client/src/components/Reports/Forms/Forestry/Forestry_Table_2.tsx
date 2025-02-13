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

export const forestry_2_gen_form_fields : GenericFormFieldV3[] = [
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
        type : "input",
        notDefault : true
    },
    // {
    //     name : "total_land_cover_area",
    //     label : "Total Land Cover Area", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "title_1",
        label : "Forest Cover", 
        type : "title"
    },
    // {
    //     name : "forest_cover.total_forest_cover",
    //     label : "Total Forest Cover", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "forest_cover.closed_forest",
        label : "Closed Forest", 
        input : (
            <Input type="number" min={0}  />
        ),
        type : "input"
    },
    {
        name : "forest_cover.open_forest",
        label : "Open Forest", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "forest_cover.mangrove_forest",
        label : "Mangrove Forest", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "title_2",
        label : "Other Land Cover", 
        type : "title"
    },
    // {
    //     name : "other_land_cover.total_other_land_cover",
    //     label : "Total Other Land Cover", 
    //     input : (
    //         <Input type="number"  />
    //     ),
    //     type : "input"
    // },
    {
        name : "other_land_cover.brush_shrubs",
        label : "Brush/Shrubs", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.grassland",
        label : "Grassland", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.annual_crop",
        label : "Annual Crop", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.perennial_crop",
        label : "Perennial Crop", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.open_barren_land",
        label : "Open/Barren Land", 
        input : (
            <Input type="number" min={0}  />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.built_up_area",
        label : "Built-up Area", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.fishpond",
        label : "Fishpond", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.marshland_swamp",
        label : "Marshland/ Swamp", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    {
        name : "other_land_cover.inland_water",
        label : "Inland Water", 
        input : (
            <Input type="number" min={0} />
        ),
        type : "input"
    },
    
];

export const forestry_2_col_defs = [
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
        headerName: "Total Land Cover Area", 
        field: "total_land_cover_area", 
        editable : false, 
        type: "numberColumn",
    },
    { 
        headerName: "Forest Cover", 
        children : [
            {
                headerName : "Total Forest Cover",
                field: "forest_cover.total_forest_cover", 
                editable : false, 
                type: "numberColumn",
            },
            {
                headerName : "Closed Forest",
                field: "forest_cover.closed_forest", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Open Forest",
                field: "forest_cover.open_forest", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Mangrove Forest",
                field: "forest_cover.mangrove_forest", 
                editable : true, 
                type: "numberColumn",
            },
        ]
    },
    { 
        headerName: "Other Land Cover", 
        children : [
            {
                headerName : "Total Other Land Cover",
                field: "other_land_cover.total_other_land_cover", 
                editable : false, 
                type: "numberColumn",
            },
            {
                headerName : "Brush/ Shrubs",
                field: "other_land_cover.brush_shrubs", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Grassland",
                field: "other_land_cover.grassland", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Annual Crop",
                field: "other_land_cover.annual_crop", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Perennial Crop",
                field: "other_land_cover.perennial_crop", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Open/Barren Land",
                field: "other_land_cover.open_barren_land", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Built-up Area",
                field: "other_land_cover.built_up_area", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Fishpond",
                field: "other_land_cover.fishpond", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Marshland/ Swamp",
                field: "other_land_cover.marshland_swamp", 
                editable : true, 
                type: "numberColumn",
            },
            {
                headerName : "Inland Water",
                field: "other_land_cover.inland_water", 
                editable : true, 
                type: "numberColumn",
            }
        ]
    },
]

const Forestry_Table_2  = () => {

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
        
        ...forestry_2_col_defs,
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
        d.data.forest_cover.total_forest_cover = _.sum([
            d.data.forest_cover.closed_forest,
            d.data.forest_cover.open_forest,
            d.data.forest_cover.mangrove_forest,
        ]);
        d.data.other_land_cover.total_other_land_cover = _.sum([
            d.data.other_land_cover.brush_shrubs,
            d.data.other_land_cover.grassland,
            d.data.other_land_cover.annual_crop,
            d.data.other_land_cover.perennial_crop,
            d.data.other_land_cover.open_barren_land,
            d.data.other_land_cover.built_up_area,
            d.data.other_land_cover.fishpond,
            d.data.other_land_cover.marshland_swamp,
            d.data.other_land_cover.inland_water,
        ]);
        d.data.total_land_cover_area = d.data.forest_cover.total_forest_cover + d.data.other_land_cover.total_other_land_cover;
        formUpdate(d.data, FormEnum.FORESTRY_2, Sector.FORESTRY)
        .then(res => {
            messageApi.success("Data successfully updated.");
            setRefresh(!refresh)
        })
        .catch(err => {
            console.log(err) 
            messageApi.error(parseResError(err).msg)
        })
        .finally(() => setRefresh(!refresh));
    }

    const handleDelete = (id) => {
        formDelete(id, FormEnum.FORESTRY_2, Sector.FORESTRY)
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
        d["forest_cover.total_forest_cover"] = _.sum([
            parseInt(d["forest_cover.closed_forest"]),
            parseInt(d["forest_cover.open_forest"]),
            parseInt(d["forest_cover.mangrove_forest"]),
        ]);
        d["other_land_cover.total_other_land_cover"] = _.sum([
            parseInt(d["other_land_cover.brush_shrubs"]),
            parseInt(d["other_land_cover.grassland"]),
            parseInt(d["other_land_cover.annual_crop"]),
            parseInt(d["other_land_cover.perennial_crop"]),
            parseInt(d["other_land_cover.open_barren_land"]),
            parseInt(d["other_land_cover.built_up_area"]),
            parseInt(d["other_land_cover.fishpond"]),
            parseInt(d["other_land_cover.marshland_swamp"]),
            parseInt(d["other_land_cover.inland_water"]),
        ]);
        d["total_land_cover_area"] = parseInt(d["forest_cover.total_forest_cover"]) + parseInt(d["other_land_cover.total_other_land_cover"]);
        try {
            await formCreate(d, FormEnum.FORESTRY_2, Sector.FORESTRY)
            messageApi.success("Data successfully inserted.");
        } catch (err) {
            messageApi.error(parseResError(err).msg)
        }
        setRefresh(!refresh)

    };
    
    useEffect(() => {
        setLoading(true)
        formGet(FormEnum.FORESTRY_2, Sector.FORESTRY, limit, page)
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
            fields={forestry_2_gen_form_fields} 
            onClose={() => setAddRecord(false)} 
            onSubmit={handleSubmit} />
        </>
    )
}


export default Forestry_Table_2;