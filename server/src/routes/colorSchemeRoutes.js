import express from "express"
import mongoose from "mongoose";
import { createCRUDController } from "../controller/forms/formController.js";
import ColorSchemeModel from "../model/ColorScheme.js";


const colorSchemeController = createCRUDController(ColorSchemeModel);

const router = express.Router();

router.get("", colorSchemeController.getAll);
router.post("", colorSchemeController.create);
router.put("", colorSchemeController.update);
router.delete("/:id", colorSchemeController.delete);
router.post("/save-many", colorSchemeController.saveMany);
router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const m = await ColorSchemeModel.find(query).populate(populate)

        return res.json(m)

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
});


export default router;