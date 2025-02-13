import { body, param } from "express-validator";
import UserModel from "../../model/User.js";
import UnitModel from "../../model/Unit.js";
import ProgramModel from "../../model/Program.js";
import { getUserIdFromToken } from "../../controller/userController.js";
import mongoose from "mongoose";

export const userLoginValidation = [
    body("email").exists().notEmpty().isString().isEmail(),
    body("password").exists().notEmpty().isString()
]

export const userSignupValidation = [
    body("name")
    .exists().withMessage("Name is required")
    .notEmpty().withMessage("Name must not be empty")
    .isString().withMessage("Name must be string"),

    body("email")
    .exists().withMessage("Email is required")
    .notEmpty().withMessage("Email must not be empty")
    .isString().withMessage("Email must be a valid string")
    .isEmail().withMessage("Incorrect email format")
    .custom(async(value) => {
        const isExist = await UserModel.exists({email: value});
        if(isExist){
            throw new Error('Email is already registered.');
        }
        return true;
    }),

    body("password")
    .exists().withMessage("Password is required")
    .notEmpty().withMessage("Password must not be empty"),

    body("role")
    .exists().withMessage("Role is required")
    .notEmpty().withMessage("Role must not be empty"),

    // body("userRole")
    // .exists().withMessage("Role is required")
    // .notEmpty().withMessage("Role must not be empty")
    // .isString().withMessage("Role must be string")
    // .custom(async (value) => {
    //     const isExist = await RoleModel.exists({value: value});
    //     if(!isExist){
    //         throw new Error('Invalid User Role.');
    //     }
    //     return true;
    // })
]

export const refreshTokenValidation = [ 
    body("refreshToken").exists().notEmpty().isString()
]

export const getByIdValidation = [
    param("id")
    .exists()
    .withMessage("Invalid data")
    .notEmpty()
    .withMessage("Id should not be empty")
]

export const updateuserValidation = [
    param("id")
    .exists("Id is required")
    .custom(async (value, {req}) => {
        const user = await UserModel.findOne({ _id : value});
        const actorId = getUserIdFromToken(req.cookies.accessToken)
        if(!user){
            throw new Error('Invalid user id.');
        }
        // if(value == actorId) {
        //     throw new Error('Invalid user id.');
        // }
    }),

    body("name")
    .exists().withMessage("Name is required")
    .notEmpty().withMessage("Name must not be empty")
    .isString().withMessage("Name must be string"),

    body("email")
    .exists().withMessage("Email is required")
    .notEmpty().withMessage("Email must not be empty")
    .isString().withMessage("Email must be a valid string")
    .isEmail().withMessage("Incorrect email format")
    .custom(async(value, { req }) => {
        const user = await UserModel.findById(req.params.id);
        const isExist = await UserModel.exists({email: value});
        if(isExist && user.email != value){
            throw new Error('Email is already registered.');
        }
        return true;
    }),
]


export const assignToUntOrPrgrmValidation = [
    body("userId")
    .exists().withMessage("User Id is required.")
    .notEmpty().withMessage("User should not be empty")
    .custom(async (value) => {
        if(!value){
            return
        }
        if(!mongoose.Types.ObjectId.isValid(value)){
            throw new Error("User should be an existing user.")
        }
        const exist = await UserModel.findById(value);
        if(!exist){
            throw new Error("User should be an existing user.")
        }
        return true;
    }),

    body("programId")
    .custom(async (value, {req}) => {
        if(!value){
            return
        }
        if(!mongoose.Types.ObjectId.isValid(value)){
            throw new Error("Program should be an existing program.")
        }
        const exist = await ProgramModel.findOne({_id: value, deletedAt : null});
        if(!exist){
            throw new Error("Program should be an existing program.")
        }
        const head = await ProgramModel.findOne({_id : value, programHead: req.body.userId, deletedAt : null})
        if(head) {
            throw new Error("Program is already assigned to the user.")

        }
        return true;
    }),

    body("unitId")
    .custom(async (value, {req}) => {
        if(!value){
            return
        }
        if(!mongoose.Types.ObjectId.isValid(value)){
            throw new Error("Unit should be an existing program.")
        }
        const exist = await UnitModel.findOne({_id : value, deletedAt : null});
        if(!exist){
            throw new Error("Unit does not exist")
        }
        const head = await UnitModel.findOne({unitHead: req.body.userId, deletedAt : null, _id : value})
        if(head) {
            throw new Error("Unit is already assigned to the user.")

        }
        return true;
    }),
]