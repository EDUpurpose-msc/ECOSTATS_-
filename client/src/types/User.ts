export interface User {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
    role : string,
    verifiedAt : Date|null
}