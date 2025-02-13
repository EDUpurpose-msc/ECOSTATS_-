import { Program } from "./Program";
import { User } from "./User";


export interface Unit {
    _id : string,
    name : string,
    programId : string | Program
    unitHead : string | User
}