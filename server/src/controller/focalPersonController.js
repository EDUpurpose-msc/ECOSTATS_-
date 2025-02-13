import { validationResult } from "express-validator";
import UserModel from "../model/User.js";
import ProgramModel from "../model/Program.js";
import mongoose from "mongoose";
import UnitModel from "../model/Unit.js";
import FocalPersonModel from "../model/FocalPerson.js";

export const getByQuery = async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const fp = await FocalPersonModel.find(query).populate(populate)

        return res.json(fp)

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

