import axios from "axios";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const createUnit = async (userId : string, name : string, programId : string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/units/create`, {userId, name, programId});
    return res;
}

export const searchUnitByName = async (name : string) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/units/search/${name}`);
    return res;
}

export const countUnits = async (year : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/units/count?year=${year}`);
    return res;
}

export const getByProgram = async (page:number, limit:number, programId : string|null, name?:string|null) : Promise<any> => {
    let query = `page=${page}&limit=${limit}`;
    if(name){
        query += `&name=${name}`;
    }
    if(programId){
        query += `&programId=${programId}`;
    }
    const res = await axios.get(`${apiUrl}/units/all?${query}`);
    return res;
}


export const deleteUnit = async (unitId : string) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/units/delete/${unitId}`);
    return res;
}

export const updateUnit = async (id :string, name : string) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/units/update`, {id, name});
    return res;
}

export const getUnitById = async (unitId:string) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/units/get-by-id/${unitId}`);
    return res;
}

export const addFocalPerson = async (unitId:string, userId:string, position:string) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/units/add-focal-person`, { unitId, userId, position });
    return res;
}

export const getFocalPersons = async (unitId:string) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/units/get-focals/${unitId}`);
    return res;

}

export const removeFocal = async (id:string) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/units/remove-focal/${id}`);
    return res;
}

export const getUnitsByQuery = async (query : any, populate : any[]) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/units/query`, {
        params : {
            query : JSON.stringify(query),
            populate : JSON.stringify(populate),
        }
    });
    return res;
}

// export const getUnitHeads = async (unitId : string) : Promise<any> => {
//     const res = await axios.get(`${apiUrl}/units/heads/${unitId}`);
//     return res;
// }

// export const removeUnitHead = async (unitId:string, userId:string) : Promise<any> => {
//     const res = await axios.delete(`${apiUrl}/units/remove-head`, {
//         params : { unitId: unitId, userId }
//     });
//     return res;
// }