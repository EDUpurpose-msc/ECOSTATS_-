import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const reportDataUpdate = async (model : any, _id : string) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/report-data`, {
        model : model,
        _id : _id
    });
    return res;
}

export const reportDataDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/report-data/${id}`);
    return res;
}

export const reportDataCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/report-data`, {
        model : model
    });
    return res;
}

export const reportDataSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/report-data/save-many`, {
        models : models
    });
    return res;
}

export const reportDataGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/report-data`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const reportDataGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/report-data/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


// tensor prediction


