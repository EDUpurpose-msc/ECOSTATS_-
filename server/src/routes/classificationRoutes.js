
import express from "express"
import { createCRUDController } from "../controller/forms/formController.js";
import ReportConfigModel from "../model/ReportConfig.js";
import mongoose from "mongoose";

import SectorModel from "../model/Sector.js";
import ChartConfigModel from "../model/ChartConfig.js";
import RequestedReportModel from "../model/RequestedReport.js";
import UserModel from "../model/User.js";
import ClassificationModel from "../model/Classification.js";

const classification = createCRUDController(ClassificationModel);


const router = express.Router();

router.get("", classification.getAll);
router.post("", async (req, res) => {
    try {
        console.log(req.body);
        const {sector_id, classifications} = req.body.model;
        console.log({sector_id, classifications});

        if(await ClassificationModel.exists({sector_id})){
            await ClassificationModel.findOneAndUpdate({sector_id}, {classifications});
            return res.json();
        }

        const classification = new ClassificationModel({
            sector_id,
            classifications
        });
        await classification.save();
        return res.json(classification);

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
router.put("", classification.update);
router.delete("/:id", classification.delete);
router.post("/save-many", classification.saveMany);

router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const m = await ClassificationModel.find(query).populate(populate)

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
