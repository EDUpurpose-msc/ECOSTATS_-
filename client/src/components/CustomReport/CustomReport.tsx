
import Title from "antd/es/typography/Title";
import { FormEnum, reportTitles, Sector } from "../../types/forms/formNameEnum";
import { GenericFormFieldV3 } from "../../types/forms/GenericFormTypes";
import { Alert, Button, Drawer, Flex, message, Popconfirm, Space, Tooltip } from "antd";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { delRequestReport, formGetByQuery, getRequestReportByQuery, requestReport } from "../../services/api/formsApi";
import { parseResError } from "../../services/errorHandler";
import CustomReportGenerator from "./GenericFormReportFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faInfo, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { AgGridReact } from "ag-grid-react";
import { usePreviewReportStore, useViewLogsStore } from "../../stores/useReportStore";
import { useReactToPrint } from "react-to-print"
import { ViewLogs } from "../Reports/ApprovalWorkflow/ApprovalComponents";
import { getUserById } from "../../services/api/userApi";
import { getFocalPersons, getUnitsByQuery } from "../../services/api/unitApi";
import "./CustomReport.css";

interface RequestReportFormProps {
    formName : FormEnum
    fields : GenericFormFieldV3[],
    isCustom : boolean
    title : string
    btnLabel : string
}

const RequestReportForm = ({ formName,  fields, isCustom, title, btnLabel } : RequestReportFormProps) => {

    const [messageApi, contextHandler] = message.useMessage();
    const authStore = useAuthStore();
    const [open, setOpen] = useState(false);

    const handleSubmit =  async (title_, description, filter, inclusions) => {

        try {
            const data = {
                title : isCustom ? title_ : `${reportTitles[formName]} as of CY ${filter.calendar_year}`,
                description : description,
                filters : filter,
                fields : inclusions,
                form_name : formName,
                isCustom : isCustom,
                requested_by : authStore.user?._id
            }
            console.log("V1", data)
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
            <CustomReportGenerator 
            formName={formName}
            title={title}
            visible={open} 
            fields={fields} 
            isCustom={isCustom}
            onClose={() => setOpen(false)} 
            onSubmit={handleSubmit}/>
        </>
    )
}

interface CustomReportProps {
    formName : FormEnum
    sector : Sector
    fields : GenericFormFieldV3[]
    colDefs : any[]
}

export const PreviewPrint = () => {

    const [gridKey, setGridKey] = useState<string>(`grid-key-${Math.random()}`);
    const [messageApi, contextHandler ] = message.useMessage();
    const [open, setOpen] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any[]>([]);
    const previewReportStore = usePreviewReportStore();

    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef: printRef });

    const [signatories, setSignatories] = useState<{requestedBy:string, approvedBy:string, reviewedBy : string}>({requestedBy: "", reviewedBy: "", approvedBy: ""})

    const getSignatories = async () => {
        try {
            const requestedBy = (await getUserById(previewReportStore.report.requested_by)).data;
            
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

    useEffect(() => {
        if(previewReportStore.report) {
            setOpen(true);
            setGridKey(`grid-key-${Math.random()}`)
            // formGetByQuery(previewReportStore.formName!, previewReportStore.sector!, previewReportStore.report.filters)
            // .then(res => {
            //     setRowData(res.data);
            // })
            // .catch(err => {
            //     messageApi.error(parseResError(err).msg)
            // })
            // .finally();
            getSignatories();
        }
        else {
            setOpen(false)
        }
        console.log(previewReportStore.report)
    }, [previewReportStore.report]);

    return (
        
        <Drawer 
        footer={
             <Flex align="center" justify="end" gap={4}>
                
                <Button color="primary" variant="solid" onClick={() => reactToPrintFn()} disabled={previewReportStore.report?.reviewed_at && previewReportStore.report?.approved_at && !previewReportStore.report?.rejected_by ? false : true}>Print</Button>
            </Flex>
            }
        width={"100%"}
        open={open}
        onClose={() => previewReportStore.clear()}
        size="large">
            {contextHandler}
            { renderStatus() }
            {/* Printable area  */}
            <div className="" ref={printRef}> 

                <Title className="text-center my-4" level={4}>{previewReportStore.report && previewReportStore.report.title}</Title>
                <p className="text-center my-2">{previewReportStore.report && previewReportStore.report.description}</p>

                <div className="report-table ag-theme-alpine w-fit mx-auto my-4" style={{width: 800}}  >
                    {/* <AgGridReact
                        columnDefs={previewReportStore.colDefs}
                        rowData={rowData}
                        key={gridKey}
                        autoSizeStrategy={{
                            type : "fitProvidedWidth",
                            width : 800
                        }}
                        suppressClickEdit={true}
                        domLayout="autoHeight"
                        suppressHorizontalScroll={true}
                        defaultColDef={{
                            resizable: false,
                            autoHeight : true,
                            wrapText : true,
                            editable : false,
                            wrapHeaderText : true,
                            // autoHeaderHeight: true
                        }}
                        onGridReady={params => {
                            params.api.sizeColumnsToFit();
                            const colums : any[] = []
                            previewReportStore.report.fields.forEach(e => {
                                if(!e.included){
                                    colums.push(e.name)
                                }
                            });
                            params.api.setColumnsVisible(colums, false);
                            params.api.refreshHeader()
                        }}
                        onGridPreDestroyed = {() => {
                            console.log("destroyed")
                        }}
                    /> */}
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


const CustomReport = ({ formName, sector, fields, colDefs } : CustomReportProps ) => {

    const [messageApi, contextHandler] = message.useMessage();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customRowData, setCustomRowData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const authStore = useAuthStore();
    const viewLogsStore = useViewLogsStore();
    const previewReportStore = usePreviewReportStore();

    const handleDelete = (id:string) => {
        delRequestReport(id)
        .then(res => {
            setRefresh(!refresh);
            messageApi.success("Report Successfully Deleted")
        })
        .catch(err => {
            messageApi.error(parseResError(err).msg)
        })
        .finally()
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
            headerName: "Actions",
            headerClass: "justify-center",
            flex: 1,
            cellRenderer: (params) => {
                return (
                    <Space className="w-fit">
                        <Popconfirm title="Confirm Delete" description="Are you sure you want to delete this request?" onConfirm={() => handleDelete(params.data._id)}>
                            <Button size="small" color="danger" variant="text">Delete</Button>
                        </Popconfirm>
                        {/* <Button size="small" color="primary" variant="text" onClick={() => previewReportStore.setStore(colDefs, formName, sector, params.data)}>Preview & Print</Button> */}
                        <Button size="small" color="primary" variant="text" onClick={() => viewLogsStore.setReportId(params.data._id)}>Logs</Button>
                    </Space>
                )
            }
        }
    ];

    
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const custom = await getRequestReportByQuery({
                    requested_by : authStore.user?._id,
                    form_name : formName,
                    isCustom : true
                }, [
                    { path : "config"}
                ]);
                setCustomRowData(custom.data)
                const res = await getRequestReportByQuery({
                    requested_by : authStore.user?._id,
                    form_name : formName,
                    isCustom : false
                }, [
                    { path : "config"}
                ]);
                setRowData(res.data)
            } catch (error) {
                
            } finally {
                setLoading(false)
            }
        })();
    }, [refresh]);
    

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
                formName={formName} />
            </div>

            <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
                <AgGridReact
                    defaultColDef={{
                        wrapText : true,
                        filter : "agTextFilterColumn"
                    }}
                    autoSizeStrategy={{
                        type: "fitGridWidth"
                    }}
                    pagination={true}
                    loading={loading}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={(ev) => ev.api.sizeColumnsToFit()}
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
                formName={formName} />
            </div>
            

            <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
                <AgGridReact
                    defaultColDef={{
                        wrapText : true,
                        filter : "agTextFilterColumn"
                    }}
                    autoSizeStrategy={{
                        type: "fitGridWidth"
                    }}
                    pagination={true}
                    loading={loading}
                    columnDefs={columnDefs}
                    rowData={customRowData}
                    onGridReady={(ev) => ev.api.sizeColumnsToFit()}
                />
            </div>

            <PreviewPrint />
            <ViewLogs />
            
        </>
    )
}

export default CustomReport;
