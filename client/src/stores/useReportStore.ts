import { create } from "zustand";
import { FormEnum, Sector } from "../types/forms/formNameEnum";
import { NumberFilterModel } from "ag-grid-community";

interface PreviewReportState {
    report : any
    // formName : FormEnum | null,
    // sector : Sector | null
    setReport : (report) => void,
    setStore : (report) => void,
    clear : () => void
}

export const usePreviewReportStore = create<PreviewReportState>((set) => ({
    report : null,
    // formName : null,
    // sector : null,

    setReport : (report) => 
    {
        
        set({
            report: report
        })
    },
    setStore : (report) => {
        console.log("prev report " , report)
        set({
            report
        })
    },
    clear : () => {
        set({
            report: null,
        })
    }
}));

export const useAddCommentStore = create<{
    reportId : null | string
    setReportId : (id:string|null) => void
}>(set => ({
    reportId : null,
    setReportId : (id) => {
        set({
            reportId : id
        })
    }
}));

export const useViewLogsStore = create<{
    reportId : null | string
    setReportId : (id:string|null) => void
}>(set => ({
    reportId : null,
    setReportId : (id) => {
        set({
            reportId : id
        })
    }
}));

export const useAddChartStore = create<{
    config : any
    setConfig : (config : any) => void
}>((set) => ({
    config : {},
    setConfig : (config) => {
        set({
            config : config
        })
    }
}));

export const useViewChartStore = create<{
    charts : any[]
    setCharts : (charts : any[]) => void
}>((set) => ({
    charts : [],
    setCharts : (charts) => {
        set({
            charts : charts
        })
    }
}));

export const useGenerateStore = create<{
    year : number|null
    setYear : (year : number|null) => void
}>((set) => ({
    year : null,
    setYear : (year) => {
        set({
            year : year
        })
    }
}));
