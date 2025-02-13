import express from "express"
import { 
    all,
    countPrograms,
    create ,
    deleteProgram,
    getByQuery,
    getProgramById,
    searchProgramByName,
    updateProgram
} from "../controller/programController.js";
import {
    createProgramValidation,
    updateProgramValidation
} from "../middleware/validations/programValidations.js";
import UnitModel from "../model/Unit.js";

const router = express.Router()

router.post("/create", createProgramValidation, create);

router.get("/search/:name", searchProgramByName);

router.get("/count", countPrograms);

router.get('', all)

// router.get('/heads/:programId', getProgramHeadsValidation, getProgramHeads)

// router.delete('/remove-head', removeHead)

router.delete(
    '/delete/:programId',  
    async (req, res, next) => {
        try {
            const programId = req.params.programId;
            if(await UnitModel.exists({programId : programId})){
                return res.status(400).json({
                    error: "Delete Action Failed",
                    msg: "Program already has unit setup. try deleting the units first before deleting this program."
                });
            }
            next();
        } catch (error) {
            return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
        }
    },
    deleteProgram)

router.get('/get-by-id/:programId', getProgramById)

router.put('/update', updateProgramValidation, updateProgram)

router.get('/query', getByQuery)

export default router;