import { User } from "./User"

export interface Program {
    _id : string
    name : string
    management : string
    sector :any
    programHead : User | string
}