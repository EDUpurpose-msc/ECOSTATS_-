import axios from "axios";
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const focalPersonGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/focal-persons/query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


// tensor prediction
