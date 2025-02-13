import axios from "axios";  
import _ from "lodash";

const apiUrl : string = import.meta.env.VITE_API_URL;

export const sectorUpdate = async (model : any) : Promise<any> => {
    const res = await axios.put(`${apiUrl}/sectors`, {
        model : model
    });
    return res;
}

export const sectorDelete = async (id : any) : Promise<any> => {
    const res = await axios.delete(`${apiUrl}/sectors/${id}`);
    return res;
}

export const sectorCreate = async (model : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/sectors`, {
        model : model
    });
    return res;
}

export const sectorSaveMany = async (models : any) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/sectors/save-many`, {
        models : models
    });
    return res;
}

export const sectorCopy = async (base_on : number, for_year : number) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/sectors/copy-all-sector-configs`, {
        base_on : base_on,
        for_year : for_year
    });
    return res;
}

export const sectorGet = async ( limit : number, page : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/sectors`, {
        params : {
            page, limit
        }
    });
    return res;
}

export const sectorGetByQuery = async ( query : any, populate : any) : Promise<any> => {
    console.log(JSON.stringify(populate))
    const res = await axios.get(`${apiUrl}/sectors/by-query`, {
        params : {
            query : JSON.stringify(query), 
            populate : JSON.stringify(populate)
        }
    });
    return res;
}


export const getSectorChartCountsData = async ( year : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/sectors/get-charts-count-by-sectors`, {
        params : {
            year  : year
        }
    });
    return res;
}

export const getSectorTopReportsByChartCount = async ( year : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/sectors/get-top-reports-by-chart-count`, {
        params : {
            year  : year
        }
    });
    return res;
}

export const getReportOverviewData = async ( year : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/sectors/get-reports-overview-data`, {
        params : {
            year  : year
        }
    });
    return res;
}

export const getHomeOverviewData = async ( year : number) : Promise<any> => {
    const res = await axios.get(`${apiUrl}/sectors/get-home-overview-data`, {
        params : {
            year  : year
        }
    });
    return res;
}

// tensor prediction


