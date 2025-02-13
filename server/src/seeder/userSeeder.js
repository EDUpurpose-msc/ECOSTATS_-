import UserModel from "../model/User.js"
import bcrypt, { genSalt } from "bcrypt"
// import UserRoleModel from "../model/UserRole.js";
// import RoleModel from "../model/Role.js";
import dotenv from "dotenv"

dotenv.config()

export default async function SeedUsers(){
    // await UserRoleModel.deleteMany();
    await UserModel.deleteMany();

    // const roles = await RoleModel.find();
    

    // setup admin
    const admin = new UserModel({
        name: "Admin User",
        email: "admin_ecostats@gudri.com",
        passwordHash: await bcrypt.hash("password", 10),
        verifiedAt: new Date(),
        isActive: true,
        role : "admin"
    })
    await admin.save();
    
    console.log("User seeded successfuly")

}