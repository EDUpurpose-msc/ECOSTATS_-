import axios from "axios";
import tf from "@tensorflow/tfjs";
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const budgetUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/budgets`, {
        model : model
    });
    return res;
}

export const budgetDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/budgets/${id}`);
    return res;
}

export const budgetCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/budgets`, {
        model : model
    });
    return res;
}

export const budgetSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/budgets/save-many`, {
        models : models
    });
    return res;
}

export const budgetGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/budgets`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const budgetGetByQuery = async ( query : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/budgets/by-query`, {
        params : query
    });
    return res;
}


// tensor prediction


