import axios from "axios";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const formUpdate = async (model : any, formName : string, sectorName : string) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/${sectorName}/${formName}`, {
        model : model
    });
    return res;
}

export const formDelete = async (id : any, formName : string, sectorName : string) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/${sectorName}/${formName}/${id}`);
    return res;
}

export const formCreate = async (model : any, formName : string, sectorName : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/${sectorName}/${formName}`, {
        model : model
    });
    return res;
}

export const formSaveMany = async (models : any, formName : string, sectorName : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/${sectorName}/${formName}/save-many`, {
        models : models
    });
    return res;
}

export const formGet = async (formName : string, sectorName : string, limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/${sectorName}/${formName}`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const formGetByQuery = async (formName : string, sectorName : string, query : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/${sectorName}/${formName}/by-query`, {
        params : query
    });
    return res;
}

export const requestReport = async (body : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/requested-reports/create`, body);
    return res;
}



export const getRequestReportByQuery = async (query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/requested-reports/get-by-query`, {
        params : {
            query : JSON.stringify(query),
            populate : JSON.stringify(populate)
        }
    });
    return res;
}

export const delRequestReport = async (id : string) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/requested-reports/delete/${id}`);
    return res;
}

export const addComment = async ({comment, message, reportId}) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/requested-reports/add-log`, {comment, message, reportId});
    return res;
}

export const getLogsByQuery = async (query, populate) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/requested-reports/get-logs-by-query`, {
        params: {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}

export const reviewReport = async (id : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/requested-reports/review-report/${id}`);
    return res;
}

export const approveReport = async (id : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/requested-reports/approve-report/${id}`);
    return res;
}

export const rejectReport = async (id : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/requested-reports/reject-report/${id}`);
    return res;
}