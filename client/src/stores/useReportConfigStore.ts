import { create } from "zustand";


export const useAddReportConfigStore = create<{
    sector : any | null
    setSector : (sector : any|null) => void
}>((set) => ({
   sector: null,
   setSector : (sector : any|null) => {
       set({sector : sector})
   }
}));

export const useUpdateReportConfigStore = create<{
    reportData : any
    setReportData : (reportData : any|null) => void
}>((set) => ({
    reportData: {},
   setReportData : (reportData : any|null) => {
       set({reportData : reportData})
   }
}));

export const useReportFieldsStore = create<{
    reportData : any
    setReportData : (reportData : any|null) => void
}>((set) => ({
    reportData: {},
   setReportData : (reportData : any|null) => {
       set({reportData : reportData})
   }
}));

export const useInsertFieldStore = create<{
    reportData : any
    setReportData : (reportData : any|null) => void
}>((set) => ({
    reportData: {},
   setReportData : (reportData : any|null) => {
       set({reportData : reportData})
   }
}));

export const useUpdateFieldsStore = create<{
    report_config_id : string
    field : any,
    setStore : (report_config_id : string, field : any) => void
    clear : () => void
}>((set) => ({
    report_config_id : "",
    field : {},
    setStore : (report_config_id : string, field : any) => {
        set({report_config_id : report_config_id, field : field})
    },
    clear : () => {
        set({report_config_id : "", field : {}})
    }
}));

export const useUpdateReportNameStore = create<{
    reportData : any
    setReportData : (reportData : any) => void
}>((set) => ({
    reportData: {},
   setReportData : (reportData : any) => {
       set({reportData : reportData})
   }    
}));