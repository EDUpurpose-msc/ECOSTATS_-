import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const chartConfigUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/chart-config`, {
        model : model
    });
    return res;
}

export const chartConfigDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/chart-config/${id}`);
    return res;
}

export const chartConfigCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/chart-config`, {
        model : model
    });
    return res;
}

export const chartConfigSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/chart-config/save-many`, {
        models : models
    });
    return res;
}

export const chartConfigGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/chart-config`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const chartConfigGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/chart-config/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


// tensor prediction


