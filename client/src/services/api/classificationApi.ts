import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const classificationUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/classification`, {
        model : model
    });
    return res;
}

export const classificationDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/classification/${id}`);
    return res;
}

export const classificationCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/classification`, {
        model : model
    });
    return res;
}

export const classificationSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/classification/save-many`, {
        models : models
    });
    return res;
}


export const classificationGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/classification`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const classificationGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    console.log(JSON.stringify(populate))
    const res = await axios.get(`${apiUrl}/classification/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}



