
import Title from "antd/es/typography/Title";
import { GenericFormFieldV3 } from "../../types/forms/GenericFormTypes";
import { Alert, Badge, Button, DatePicker, Drawer, Flex, Input, message, Popconfirm, Select, Space, Tooltip, Typography } from "antd";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { delRequestReport, formGetByQuery, getRequestReportByQuery, requestReport } from "../../services/api/formsApi";
import { parseResError } from "../../services/errorHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faInfo, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { AgGridReact } from "ag-grid-react";
import { usePreviewReportStore, useViewLogsStore } from "../../stores/useReportStore";
import { useReactToPrint } from "react-to-print"
import { ViewLogs } from "../Reports/ApprovalWorkflow/ApprovalComponents";
import { getUserById } from "../../services/api/userApi";
import { getUnitsByQuery } from "../../services/api/unitApi";
import "../CustomReport/CustomReport.css";
import { convertReportFilters, flattenFields, generateColDefs } from "../../services/helper";
// import { generateGenericFields } from "./DataEntry";
import CustomReportGeneratorV2 from "./CustomReportGeneratorV2";
import { reportDataGet, reportDataGetByQuery } from "../../services/api/reportDataApi";
import { reportConfigGetByQuery } from "../../services/api/reportConfigApi";
import "./GeneratedReport.css";
import { wrap } from "lodash";

import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withParams({
        backgroundColor: "#FFFFFF",
        borderColor: "#000000F2",
        borderRadius: "0px",
        browserColorScheme: "light",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        columnBorder: true,
        foregroundColor: "#000000",
        headerBackgroundColor: "#FFFFFF",
        headerColumnBorder: true,
        headerFontSize: 14,
        // headerVerticalPaddingScale: 0,
        // rowVerticalPaddingScale: 1,
        spacing: "7.5px",
        wrapperBorder: true,
        wrapperBorderRadius: "0px"
    });




export const generateGenericFields  = (fields : any[]) : GenericFormFieldV3[] => {
    return flattenFields(fields).filter(field => field.identifier && field.name).map(field => {
      const _field : GenericFormFieldV3 = {
        label : field.name,
        name : field.identifier,
        required : true,
        input :( <Input type="text" />),
        type : field.is_nested ? "title" : "input",
      }
  
    //   if(!field.is_nested && !field.editable ){
    //     _field.initialValue = field.default;
    //     if(field.input_type === "enum"){
    //         _field.input = (<Select disabled options={field.values.map((v : any) => ({label : v, value : v}))} />)
    //     }
    //     if(field.input_type === "text"){
    //     _field.input = (<Input readOnly type="text" />)
    //     }
    //     if(field.input_type === "number"){
    //     _field.input = (<Input readOnly type="number" min={0} />)
    //     }
    //     if(field.input_type === "date"){
    //     _field.input = (<DatePicker readOnly  />)
    //     }
    //   }

    //   if(!field.is_nested && !field.editable && field.computed_value){
    //     return null;
    //   }
  
      if(!field.is_nested){
        if(field.input_type === "enum"){
          _field.input = (<Select options={field.values.map((v : any) => ({label : v, value : v}))} />)
        }
        if(field.input_type === "text"){
          _field.input = (<Input type="text" />)
        }
        if(field.input_type === "number"){
          _field.input = (<Input type="number" min={0} />)
        }
        if(field.input_type === "date"){
          _field.input = (<DatePicker  />)
        }
      }
      return _field;
    })
    .filter(field => field !== null);
}

interface RequestReportFormProps {
    config : any
    fields : GenericFormFieldV3[],
    isCustom : boolean
    title : string
    btnLabel : string
}

const RequestReportForm = ({ config,  fields, isCustom, title, btnLabel } : RequestReportFormProps) => {

    const [messageApi, contextHandler] = message.useMessage();
    const authStore = useAuthStore();
    const [open, setOpen] = useState(false);

    const handleSubmit =  async (title_, description, filter, inclusions) => {

        try {
            const data = {
                title : isCustom ? title_ : config.name,
                description : description,
                filters : filter,
                fields : inclusions,
                report_config_id : config._id,
                isCustom : isCustom,
                requested_by : authStore.user?._id
            }
            console.log("V2", data)
            await requestReport(data);
            messageApi.success("New report request successfully submitted.")
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        }
    }

    return (
        <>
            { contextHandler }
            <Button onClick={() => setOpen(true)}>{btnLabel}</Button>
            <CustomReportGeneratorV2
            // formName={formName}
            config={config}
            title={title}
            visible={open} 
            fields={fields} 
            isCustom={isCustom}
            onClose={() => setOpen(false)} 
            onSubmit={handleSubmit}/>
        </>
    )
}


export const PreviewPrint = ({onApprove, onReject} : {onApprove? : (id) => void, onReject? : (id) => void}) => {

    const [gridKey, setGridKey] = useState<string>(`grid-key-${Math.random()}`);
    const [messageApi, contextHandler ] = message.useMessage();
    const [open, setOpen] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any[]>([]);
    const previewReportStore = usePreviewReportStore();
    const [colDefs, setColDefs] = useState<any[]>([]);

    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef: printRef });

    const [signatories, setSignatories] = useState<{requestedBy:string, approvedBy:string, reviewedBy : string}>({requestedBy: "", reviewedBy: "", approvedBy: ""})

    const getSignatories = async () => {
        try {
            const requestedBy = (await getUserById(previewReportStore.report.requested_by._id || previewReportStore.report.requested_by)).data;
            console.log(requestedBy)
            const unit = (await getUnitsByQuery({
                _id : previewReportStore.report.unit_id
            }, [
                {
                    path : "unitHead",
                },
                {
                    path : "programId",
                },
                {
                    path : "programId.programHead",
                }
            ])).data[0];
            console.log(unit)
            const approvedBy = (await getUserById(unit.programId.programHead)).data;
            setSignatories({
                requestedBy: requestedBy.name,
                reviewedBy : unit.unitHead.name,
                approvedBy : approvedBy.name
            })
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        }   
    }

    const renderStatus = () => {
        if(previewReportStore.report?.reviewed_at && previewReportStore.report?.approved_at && !previewReportStore.report?.rejected_by){
            return <Alert className="w-fit mx-auto" message="Approved" type="success" />
        }
        return <Alert className="w-fit mx-auto" message="Not yet Approved" type="error" />
    }

    const init = async () => {
        try {
            const config = (await reportConfigGetByQuery({_id : previewReportStore.report.report_config_id}, [])).data[0];
            setColDefs(generateColDefs(config.fields))
            const filters = convertReportFilters(previewReportStore.report.filters || {});
            const _rowData = (await reportDataGetByQuery({
                report_config_id : previewReportStore.report.report_config_id,
                ...filters
            }, [])).data;
            setRowData(_rowData.map(d => d.data));

            getSignatories();

            setGridKey(`grid-key-${Math.random()}`);
        } catch (error) {
            message.error(parseResError(error).msg)
        }
    }

    useEffect(() => {
        if(previewReportStore.report) {
            setOpen(true);
            init();
        }
        else {
            setOpen(false)
        }
    }, [previewReportStore.report]);

    function addPrintStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
          @media print {
            /* Ensure the grid spans the entire width of the page */
            .ag-theme-alpine {
              width: 100% !important;
              font-size: 10px; /* Adjust font size to make sure the grid fits */
              table-layout: fixed;
            }
      
            /* Adjust the print margins and page setup */
            body {
              margin: 0;
              padding: 0;
            }
      
            /* Optional: You can add more tweaks like hiding unnecessary elements for print */
            .no-print {
              display: none;
            }
      
            /* Optionally reduce cell padding to make grid content fit */
            .ag-cell {
              padding: 2px 5px;
            }
      
            /* If needed, force the grid container to stretch to the full width of the page */
            .ag-root-wrapper {
              width: 100% !important;
            }
          }
        `;
      
        // Append the style to the head of the document
        document.head.appendChild(style);
      }

    return (
        <Drawer 
        footer={
             <Flex align="center" justify="end" gap={4}>
                { onApprove && 
                    <Popconfirm title="Approve Report" description="Are you sure you want to approve this report?" onConfirm={() => onApprove(previewReportStore.report?._id)}>
                        <Button color="primary" variant="solid">Approve</Button>
                    </Popconfirm>
                }
                { onReject && 
                    <Popconfirm title="Reject Report" description="Are you sure you want to reject this report?" onConfirm={() => onReject(previewReportStore.report?._id)}>
                        <Button color="danger" variant="solid">Reject</Button>
                    </Popconfirm>
                }
                <Button 
                    color="primary" 
                    variant="solid" 
                    onClick={() => {
                        addPrintStyles()
                        reactToPrintFn()
                    }} 
                    disabled={previewReportStore.report?.reviewed_at && previewReportStore.report?.approved_at && !previewReportStore.report?.rejected_by ? false : true}
                >Print</Button>
            </Flex>
            }
        width={"100%"}
        open={open}
        onClose={() => previewReportStore.clear()}
        size="large">
            {contextHandler}
            { renderStatus() }
            {/* Printable area  */}
            <div className="" ref={printRef} > 
                <p className="text-center mb-0">Republic of the Philippines</p>
                <p className="text-center mb-0 font-bold text-[1rem]">DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES</p>
                <p className="text-center mb-4 font-bold texr-[1rem]" >{previewReportStore.report && previewReportStore.report.title}</p>
                <p className="text-center my-2">{previewReportStore.report && previewReportStore.report.description}</p>

                <div 
                    id="report-table"
                    className="report-table ag-theme-alpine w-fit mx-auto my-4" 
                    style={{width: "100%", maxWidth: "800px"}} 
                 >
                    <p className="mb-1">{ previewReportStore.report && previewReportStore.report.config ?   previewReportStore.report.config.form_code : "" }</p>
                    <AgGridReact
                        // theme={myTheme}
                        columnDefs={colDefs}
                        rowData={rowData}
                        key={gridKey}
                        suppressClickEdit={true}
                        domLayout="autoHeight"
                        suppressHorizontalScroll={true}

                        defaultColDef={{
                            resizable: false,
                            suppressAutoSize: true,
                            suppressMovable: true,
                            autoHeight: true,
                            wrapText: true,
                            editable: false,
                            wrapHeaderText: true,
                            cellStyle: {
                                "lineHeight": "1.3rem",
                                // "wordBreak": "keep"
                            }
                        }}
                        onGridReady={params => {
                            
                            const columnsToHide : any[] = [];
                            previewReportStore.report.fields.forEach((e:any) => {
                            if (!e.included) {
                                columnsToHide.push(e.name);
                            }
                            });
                            params.api.setColumnsVisible(columnsToHide, false);
                            params.api.refreshHeader();

                            params.api.sizeColumnsToFit();

                            // Resize columns again when the window resizes
                            window.addEventListener("resize", () => {
                                params.api.sizeColumnsToFit();
                                params.api.refreshHeader();
                            });
                        }}
                        onGridPreDestroyed={() => {
                            console.log("Grid destroyed");
                            // Clean up event listener when grid is destroyed
                            window.removeEventListener("resize", () => {});
                        }}
                    />

                </div>



                
                {/* Signatories */}
                <div className="mx-auto mt-28" style={{width: 800}}  >
                    <Flex justify="space-between">
                        <div>
                            <p>Prepared By:</p>
                            <hr className="mt-4" />
                            <p className="font-semibold">{signatories.requestedBy}</p>
                        </div>
                        <div>
                            <p>Reviewed By:</p>
                            <hr className="mt-4" />
                            <p className="font-semibold">{signatories.reviewedBy}</p>
                        </div>
                        <div>
                            <p>Approved By:</p>
                            <hr className="mt-4 " />
                            <p className="font-semibold">{signatories.approvedBy}</p>
                        </div>
                    </Flex>
                </div>
            </div>
        </Drawer>
    )
}

const FilterCellRenderer = ({params}) => {

    return (
        <div>
        {
            params.data.filters && Object.entries(params.data.filters).length > 0 ?
            Object.entries(params.data.filters).map(([key, value] : any) => {
                return (
                    <div>
                        <p className="font-semibold">{key}: <Typography.Text code className="text-gray-700 font-normal">{value}</Typography.Text></p>
                    </div>
                )
            })
            : (
                <div>
                    <p className="">N/A</p>
                </div>
            )
        }
        </div>
    );
}

const CustomReportV2 = ({ config } : {config:any} ) => {

    const [messageApi, contextHandler] = message.useMessage();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customRowData, setCustomRowData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const authStore = useAuthStore();
    const viewLogsStore = useViewLogsStore();
    const previewReportStore = usePreviewReportStore();

    const [colDefs, setColDefs] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);

    const handleDelete = async (id:string) => {
        try {
            const res = await delRequestReport(id);
            setRefresh(!refresh);
            messageApi.success("Report Successfully Deleted");
        } catch (err) {
            messageApi.error(parseResError(err).msg);
        } finally {
            setRefresh(!refresh);
        }
    }

    const columnDefs : any = [
        {
            headerName : "Title",
            field : "title"
        },
        {
            headerName : "Description",
            field : "description"
        },
        {
            headerName : "Filters",
            field : "filters",
            autoHeight : true,
            cellRenderer : (params) => {
                console.log("FilterCellRenderer", params)
                return <FilterCellRenderer params={params} />
            }
        },
        {
            headerName : "Status",
            cellRenderer : (params) => {
                return (
                    <div>
                        {!params.data.rejected_by ? (
                            <>
                                <Badge className="block" status={params.data.reviewed_at ? "success" : "default"} text={params.data.reviewed_at ? "Reviewed" : "Pending Review"} />
                                <Badge className="block" status={params.data.approved_at ? "success" : "default"} text={params.data.approved_at ? "Approved" : "Pending Approval"} />
                            </>
                        ) : (
                            <Badge className="block" status="error" text="Rejected" />
                        )}
                    </div>
                )
            }
        },
        {
            headerName: "Actions",
            headerClass: "justify-center",
            wrap: true,
            flex: 1,
            cellRenderer: (params) => {
                return (
                    <Space className="w-fit">
                        <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this request?" onConfirm={() => handleDelete(params.data._id)}>
                            <Button size="small" color="danger" variant="text">Delete</Button>
                        </Popconfirm>
                        <Button size="small" color="primary" variant="text" onClick={() => {
                            previewReportStore.setStore(params.data)
                        }}>Preview & Print</Button>
                        <Button size="small" color="primary" variant="text" onClick={() => viewLogsStore.setReportId(params.data._id)}>Logs</Button>
                    </Space>
                )
            }
        }
    ];

    useEffect(() => {
        if(config.fields && config.fields.length > 0){
            setColDefs(generateColDefs(config.fields));
            console.log("FIELDS", generateGenericFields(config.fields).filter(field => field))
            setFields(generateGenericFields(config.fields).filter(field => field));
        }
    }, [config])

    
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const custom = await getRequestReportByQuery({
                    requested_by : authStore.user?._id,
                    // form_name : formName,
                    report_config_id : config._id,
                    isCustom : true
                }, []);
                setCustomRowData(custom.data)
                const res = await getRequestReportByQuery({
                    requested_by : authStore.user?._id,
                    // form_name : formName,
                    report_config_id : config._id,
                    isCustom : false
                }, []);
                setRowData(res.data);
                console.log(res.data)
            } catch (error) {
                message.error(parseResError(error).msg)
            } finally {
                setLoading(false)
            }
        })();
    }, [refresh, config]);
    

    return (
        <>
            { contextHandler }

            <Title level={5} className="mb-2">
                <Tooltip title="Generate Reports using the default template">
                    <FontAwesomeIcon className="text-blue-500 me-2" icon={faCircleInfo} />
                </Tooltip>
                Default  
                <Button className="ml-2" variant="text" color="primary" onClick={() => setRefresh(!refresh)} size="small" icon={<FontAwesomeIcon icon={faRefresh} />}></Button>
            </Title>

            <div className="mb-4">
                <RequestReportForm 
                    btnLabel="Generate Report"
                    title="Generate Report"
                    isCustom={false} 
                    fields={fields} 
                    config={config} />
            </div>

            <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
                <AgGridReact
                    defaultColDef={{
                        wrapText : true,
                        filter : "agTextFilterColumn",
                        autoHeight : true,
                        cellStyle : {
                            "lineHeight": "1.5rem",
                        }
                    }}
                    // autoSizeStrategy={{
                    //     // type: "fitGridWidth"
                    // }}
                    pagination={true}
                    loading={loading}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    // onGridReady={(ev) => ev.api.sizeColumnsToFit()}
                />
            </div>
            
            <hr className="my-4" />

            <Title level={5} className="mb-2">
                <Tooltip title="Customize Reports by selecting fields">
                    <FontAwesomeIcon className="text-blue-500 me-2" icon={faCircleInfo} />
                </Tooltip>
                Custom Reports  
                <Button className="ml-2" variant="text" color="primary" onClick={() => setRefresh(!refresh)} size="small" icon={<FontAwesomeIcon icon={faRefresh} />}></Button>
            </Title>

            <div className="mb-4">
                <RequestReportForm 
                btnLabel="Generate Custom Report"
                title="Generate Custom Report" 
                isCustom={true} 
                fields={fields} 
                config={config} />
            </div>
            

            <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
                <AgGridReact
                    defaultColDef={{
                        wrapText : true,
                        filter : "agTextFilterColumn",
                        autoHeight : true,
                        cellStyle : {
                            "lineHeight": "1.5rem",
                        }
                        
                    }}
                    // autoSizeStrategy={{
                    //     type: "fitGridWidth"
                    // }}
                    pagination={true}
                    loading={loading}
                    columnDefs={columnDefs}
                    rowData={customRowData}
                    // onGridReady={(ev) => ev.api.sizeColumnsToFit()}
                    // frameworkComponents={{
                    //     filtersRenderer: FilterCellRenderer // Register the React component
                    // }}
                />
            </div>

            <PreviewPrint />
            <ViewLogs />
            
        </>
    )
}

export default CustomReportV2;
