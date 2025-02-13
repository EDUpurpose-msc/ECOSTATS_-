import { ValidationError } from "../types/ApiValidationError";

interface Prop {
    errors : ValidationError[],
    name : string
}
const FieldError = (prop : Prop) => {
    
    return (
        <div className="mb-2">
        {
            prop.errors.filter(error => error.path == prop.name).map((error, i) => {
                return (<p key={i} className="text-left text-red-400 mb-0">{error.msg}</p>)
            })
        }
        </div>
    )
}

export default FieldError;