import { validationResult } from "express-validator";
import UserModel from "../model/User.js";
import ProgramModel from "../model/Program.js";
import UnitModel from "../model/Unit.js";
import mongoose, { mongo } from "mongoose";
import FocalPersonModel from "../model/FocalPerson.js";
import SectorModel from "../model/Sector.js";


export const create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const userId = req.body.userId;
        const name = req.body.name;
        const programId = req.body.programId;

        const unit = new  UnitModel({
            name: name,
            programId : programId,
            unitHead : userId
        });
        await unit.save({session});
        
        await session.commitTransaction();

        return res.send();
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    } finally {
        session.endSession();
    }
}

export const searchUnitByName = async (req, res) => {
    try {
        const name = req.params.name; 

        const units = await UnitModel.find({ name : { $regex : name, $options: "i" }, deletedAt : null}).populate("unitHead");

        return res.json(units)
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

export const countUnits = async (req, res) => {
    try {

        const {year} = req.query;
        const sectors = await SectorModel.find({calendar_year : year});
        const programs = await ProgramModel.find({
            deletedAt: null,
            sector_id : {
                $in : sectors.map(s => s._id)
            }
        }); 
        const units = await UnitModel.countDocuments({
            deletedAt:null,
            programId : {
                $in : programs.map(p => p._id)
            }
        });

        return res.json(units)
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

export const getByProgram = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const programId = req.query.programId;
        const name = req.query.name; 

        const skip = (page - 1) * limit;

        const total = await UnitModel.countDocuments({
            deletedAt : null,
            programId : programId
        });

        const q = name ? { 
            name : { 
                $regex : name, 
                $options: "i" 
            }, 
            deletedAt : null 
        } : {
            deletedAt  : null
        }

        if(programId) {
            q.programId = programId
        }

        const units = await UnitModel.find(q)
                            .skip(skip)
                            .limit(limit)
                            .populate("unitHead");

        return res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            units: units,
        })
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

export const deleteUnit = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const unitId = req.params.unitId;
      
      await UnitModel.findOneAndUpdate({
        _id : unitId
      }, {
        deletedAt : Date.now()
      })
      .session(session);

      await FocalPersonModel.updateMany({
        unitId : unitId
      }, {
        deletedAt : Date.now()
      })
      .session(session);
      
      await session.commitTransaction();
      res.send();
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    } finally {
        await session.endSession();
    }
}

export const updateUnit = async (req, res) => {
    try {
        const unitId = req.body.id;
        const name = req.body.name;

        const unit = await UnitModel.findOneAndUpdate({
            _id : unitId
        }, {
            name : name
        });

        return res.status(200).json(await UnitModel.findById(unit._id))
       
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

export const getUnitById = async (req, res) => {
    try {
        const unitId = req.params.unitId;

        const unit = await UnitModel.findById(unitId).populate("unitHead");

        return res.status(200).json(unit)
       
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

export const addFocalPerson = async (req, res) => {
    try {
        
        const { unitId , userId, position } = req.body;

        const exists = await FocalPersonModel.exists({ userId : userId, deletedAt : null, unitId : unitId });
        if(exists) {
            return res.status(500).json({
                error: "Duplicate",
                msg: "User is already assigned to a unit."
            });
        }

        const focal = new FocalPersonModel({
            userId,
            unitId,
            position
        });
        await focal.save();

        return res.send();

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

export const getFocalPersons = async (req, res) => {
    try {
        
        const { unitId } = req.params;

        const focals = await FocalPersonModel.find({
            unitId,
            deletedAt : null
        })
        .populate("userId");

        return res.json(focals)

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

export const removeFocal = async (req, res) => {
    try {
        
        const { id } = req.params;

        const focals = await FocalPersonModel.findOneAndUpdate({
            _id : id
        }, {
            deletedAt: Date.now()
        })

        return res.json()

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

export const getByQuery = async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const units = await UnitModel.find(query).populate(populate)

        return res.json(units)

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

