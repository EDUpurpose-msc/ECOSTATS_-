

interface Error {
    error : string
    msg : string
}

export const parseResError = (err) : Error => {
    console.log(err)
    try {
        if(err.response.data.msg && err.response.data.error){
            return {
                error : err.response.data.error,
                msg : err.response.data.msg
            }
        }
        if (err.response?.statusText) {
            return {
                error : err.response.statusText,
                msg : err.response.statusText
            }
        }
        if (err.message) {
            return {
                error : err.message,
                msg : err.message
            }
        }
        return {
            error : "Unknown Error",
            msg : "An unexpected error occured while processing the request"
        }
    } catch (error) {
        return {
            error : "Unknown Error",
            msg : "An unexpected error occured while processing the request"
        }
    }
}