import { validationResult } from "express-validator";
import UserModel from "../model/User.js";
import ProgramModel from "../model/Program.js";
// import ProgramHeadModel from "../model/ProgramHead.js";
import mongoose from "mongoose";
import UnitModel from "../model/Unit.js";
import SectorModel from "../model/Sector.js";
// import UnitHeadModel from "../model/UnitHead.js";

export const create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const userId = req.body.userId;
        const name = req.body.name;
        const sector_id = req.body.sector_id;

        const user = await UserModel.findById(userId);
        const program = new ProgramModel({
            name: name,
            sector_id : sector_id,
            programHead : user
        });
        await program.save({session});

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

export const searchProgramByName = async (req, res) => {
    try {
        const name = req.params.name; 

        const programs = await ProgramModel.find({ name : { $regex : name, $options: "i" }, deletedAt : null})
            .select("_id name management createdAt");

        return res.json(programs)
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

export const countPrograms = async (req, res) => {
    try {
        const {year} = req.query;
        const sectors = await SectorModel.find({calendar_year : year});
        const programs = await ProgramModel.countDocuments({
            deletedAt: null,
            sector_id : {
                $in : sectors.map(s => s._id)
            }
        });
        return res.json(programs)
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

export const all = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const name = req.query.name; 
        const year = req.query.year;

        const skip = (page - 1) * limit;

        const total = await ProgramModel.countDocuments();
        
        const sectors = await SectorModel.find({calendar_year : year});
        const q = name ? { 
            name : { 
                $regex : name, 
                $options: "i" 
            }, 
            deletedAt : null,
            sector_id : {
                $in : sectors.map(s => s._id)
            }
        } : {
            deletedAt  : null,
            sector_id : {
                $in : sectors.map(s => s._id)
            }
        };


        const programs = await ProgramModel.find(q)
            .skip(skip)
            .limit(limit)
            .select("_id name sector_id createdAt ")
            .populate(["programHead", "sector"]);

        return res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            programs: programs,
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

// export const getProgramHeads = async (req, res) => {
//     try {
//         const programId = req.params.programId;

//         const programHeads = await ProgramHeadModel.find({
//             programId: programId,
//             deletedAt : null
//         })
//         .populate({
//             path: "userId",
//             select: "_id name email createdAt"
//         });

//         return res.json(programHeads.map(p => p.userId))
       
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(
//             { 
//                 error: 'Server error.',
//                 details : error
//             }   
//         ); 
//     }
// }

// export const removeHead = async (req, res) => {
//     try {
//         const userId = req.query.userId;
//         const programId = req.query.programId;

//         const programHead = await ProgramHeadModel.findOne({
//             userId, programId, deletedAt : null
//         });
//         programHead.deletedAt = Date.now()
//         await programHead.save();

//         return res.status(200).send()
       
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(
//             { 
//                 error: 'Server error.',
//                 details : error
//             }   
//         ); 
//     }
// }

export const deleteProgram = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const programId = req.params.programId;
       
      // delete programs
      await ProgramModel.findOneAndUpdate({
        _id : programId
      }, {
        deletedAt : Date.now()
      })
      .session(session);


      await UnitModel.updateMany({
        programId : programId,
        deletedAt : null
      } , {
        deletedAt : Date.now()
      })
      .session(session);

      const unitIds = (await UnitModel.find({
        programId : programId
      })
      .session(session)).map(p => p._id);
      
      await session.commitTransaction();
      res.send();
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    } finally {
        await session.endSession()
    }
}

export const getProgramById = async (req, res) => {
    try {
        const programId = req.params.programId;

        const program = await ProgramModel.findById(programId);

        return res.status(200).json(program)
       
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

export const updateProgram = async (req, res) => {
    try {
        const programId = req.body.id;
        const name = req.body.name;
        const management = req.body.management;

        const program = await ProgramModel.findOneAndUpdate({
            _id : programId
        }, {
            name : name,
            management : management
        });

        return res.status(200).json(await ProgramModel.findById(program._id))
       
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

        const units = await ProgramModel.find(query).populate(populate)

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

