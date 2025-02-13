import express from "express"
import { 
    addFocalPerson,
    countUnits,
    create, 
    deleteUnit, 
    getByProgram, 
    getFocalPersons, 
    getUnitById, 
    getByQuery, 
    searchUnitByName,
    updateUnit,
    removeFocal
} from "../controller/unitController.js";
import {
    createUnitValidation,
    updateUnitValidation
} from "../middleware/validations/programValidations.js";

const router = express.Router()

router.post("/create", createUnitValidation, create);

router.get("/search/:name", searchUnitByName);

router.get("/count", countUnits);

router.get("/all", getByProgram);

router.delete("/delete/:unitId", deleteUnit);

router.put("/update",updateUnitValidation, updateUnit);

router.get('/get-by-id/:unitId', getUnitById)

router.post('/add-focal-person', addFocalPerson)

router.get('/get-focals/:unitId', getFocalPersons)

router.delete('/remove-focal/:id', removeFocal);

router.get('/query', getByQuery)



export default router;