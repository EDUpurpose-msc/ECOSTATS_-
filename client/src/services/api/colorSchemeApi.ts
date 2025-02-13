import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const colorSchemeUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/color-scheme`, {
        model : model
    });
    return res;
}

export const colorSchemeDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/color-scheme/${id}`);
    return res;
}

export const colorSchemeCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/color-scheme`, {
        model : model
    });
    return res;
}

export const colorSchemeSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/color-scheme/save-many`, {
        models : models
    });
    return res;
}

export const colorSchemeGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/color-scheme`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const colorSchemeGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/color-scheme/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


// tensor prediction


