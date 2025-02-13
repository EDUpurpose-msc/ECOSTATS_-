import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import Title from "antd/es/typography/Title";
import { getUnitsByQuery } from "../../../services/api/unitApi";
import { Button, message, Popconfirm, Space, Tag, Tooltip } from "antd";
import { parseResError } from "../../../services/errorHandler";
import { approveReport, getRequestReportByQuery, rejectReport, reviewReport } from "../../../services/api/formsApi";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEye, faFilePen, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { AddComment, ViewLogs } from "../../../components/Reports/ApprovalWorkflow/ApprovalComponents";
import { useAddCommentStore, usePreviewReportStore, useViewLogsStore } from "../../../stores/useReportStore";
import { ColDefsMap, FormNameMap } from "../../../types/forms/formNameEnum";
import { getProgramByQuery } from "../../../services/api/programApi";
import { PreviewPrint } from "../../../components/Reports/CustomReportV2";
import { useReportCountStore } from "../../../stores/useUserStore";



const ToApprove = () => {
    const authStore = useAuthStore();
    const addCommentStore = useAddCommentStore();
    const viewLogsStore = useViewLogsStore();
    const previewReportStore = usePreviewReportStore();

    const [ messageApi, contextHandler ] = message.useMessage();
    const [refresh, setRefresh] = useState(false);

    const [units, setUnits] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);

    const reportCountStore = useReportCountStore();

    const colDefs = [
        {
            headerName : "Title",
            field : "title"
        },
        {
            headerName : "Description",
            field : "description",
            valueFormatter : (params) => {
                return params.value ? params.value : "N/A"
            }
            
        },
        {
            headerName : "Requested By",
            field : "requested_by",
            valueFormatter : (params) => {
                return params.value.name
            }
        },
        {
            headerName : "Unit",
            field : "unit_id",
            valueFormatter : (params) => {
                return params.value.name
            }
        },
        {
            headerName : "Actions",
            cellRenderer : (params) => {
                return (
                    <Space className="w-full"> 
                        {/* <Tooltip title="Approve"  >
                            <Popconfirm title="Approve Report" description="Are you sure you want to approve this report?" onConfirm={() => handleApprove(params.data._id)}>
                                <Button size="small" variant="text" color="primary" icon={<FontAwesomeIcon icon={faThumbsUp} />}></Button>
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Reject" >
                            <Popconfirm title="Reject Report" description="Are you sure you want to reject this report?" onConfirm={() => handleReject(params.data._id)}>
                                <Button size="small" variant="text" color="danger" icon={<FontAwesomeIcon icon={faThumbsDown} />}></Button>
                            </Popconfirm>
                        </Tooltip> */}
                        <Tooltip title="Add Comment" >
                            <Button onClick={() => addCommentStore.setReportId(params.data._id)} size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faComment} />}></Button>
                        </Tooltip>
                        <Tooltip title="Preview" >
                            <Button onClick={() => {
                                console.log(params.data)
                                previewReportStore.setStore(params.data)
                            }} size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faEye} />}></Button>
                        </Tooltip>
                        <Tooltip title="Logs" >
                            <Button onClick={() => viewLogsStore.setReportId(params.data._id)} size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faFilePen} />}></Button>
                        </Tooltip>
                    </Space>
                )
            }
        }
    ];

    const getReports = async () => {
        setReports([]);
        try {
            const programs = (await getProgramByQuery({
                programHead : authStore.user!._id,
                deletedAt : null,
            }, [])).data;
            console.log("programs : ",programs)
            const units = (await getUnitsByQuery({
                programId : {
                    $in : programs.map(p => p._id)
                },
                deletedAt : null
            }, [])).data;
            console.log("units : ",units)
            setUnits(units);
            const _reports = (await getRequestReportByQuery(
                {
                    unit_id : {
                        $in : units.length > 0 ? units.map(u => u._id) : []
                    },
                    approved_at : null,
                    reviewed_at: {
                        $ne : null
                    },
                    rejected_by: null
                },
                [
                    { path : "unit_id"},
                    { path : "requested_by"},
                    { path : "config"},
                ]
            )).data;
            console.log("reports : ",_reports);
            setReports(_reports);
            setRowData(_reports);
            console.log("reports : ",_reports)
        } catch (error) {
            messageApi.error(parseResError(error).msg);
        }
    }
    
    const handleApprove = async (id) => {
        try {
            await approveReport(id);
            setRefresh(!refresh);
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        }
    }

    const handleReject = async (id) => {
        try {
            await rejectReport(id);
            setRefresh(!refresh);
        } catch (error) {
            messageApi.error(parseResError(error).msg)
        }
    }

    useEffect(() => {
        if(authStore.user){
            getReports()
            console.log(ColDefsMap)
        }
    }, [authStore.user, refresh]);


    return (
        <>
            { contextHandler }
            <Title level={4}>To Approve</Title>
            <div>
                Units:  {
                    units.length > 0 && units.map(u => {
                        return <Tag key={u._id}>{u.name}</Tag>
                    })
                }
            </div>

            <div className="ag-theme-alpine mt-5" style={{ width: '100%', height: '500px' }}>
                <AgGridReact
                    defaultColDef={{
                        wrapText : true,
                        filter : "agTextFilterColumn",
                        autoHeight : true,
                        cellStyle : {
                            "lineHeight" : "1.5rem"
                        },
                    }}
                    pagination={true}
                    columnDefs={colDefs}
                    rowData={rowData}
                    onGridReady={(ev) => ev.api.sizeColumnsToFit()}
                />
            </div>

            <AddComment />
            <ViewLogs />
            <PreviewPrint
                onApprove={(e) => {
                    handleApprove(e);
                    reportCountStore.setRefresh(!reportCountStore.refresh);
                    previewReportStore.setStore(null);
                }}
                onReject={(e) => {
                    handleReject(e);
                    reportCountStore.setRefresh(!reportCountStore.refresh);
                    previewReportStore.setStore(null);
                }} 
            />
        </>
    )
}

export default ToApprove;