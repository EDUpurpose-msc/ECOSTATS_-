import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const reportConfigUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/report-configs`, {
        model : model
    });
    return res;
}

export const reportConfigUpdateField = async (report_config_id, updatedData, identifier) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/report-configs/update-field`, {
        report_config_id : report_config_id, 
        updatedData :  updatedData, 
        identifier: identifier
    });
    return res;
}

export const reportConfigDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/report-configs/${id}`);
    return res;
}

export const reportConfigDeleteField = async (report_config_id, identifier) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/report-configs/fields/delete`, {
        params : {
            
            report_config_id : report_config_id, 
            identifier: identifier
        }
    });
    return res;
}

export const reportConfigCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/report-configs`, {
        model : model
    });
    return res;
}

export const reportConfigSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/report-configs/save-many`, {
        models : models
    });
    return res;
}

export const reportConfigInsertField = async (report_config_id : string, newField : any, position_identifier  : string, position : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/report-configs/fields/insert`, {
        report_config_id, newField, position_identifier, position
    });
    return res;
}

export const reportConfigGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/report-configs`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const reportConfigGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/report-configs/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


// tensor prediction


