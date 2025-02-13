import express from "express"
import mongoose from "mongoose";
import { createCRUDController } from "../controller/forms/formController.js";
import ReportDataModel from "../model/ReportData.js";


const reportDataController = createCRUDController(ReportDataModel);

const router = express.Router();

router.get("", reportDataController.getAll);
router.post("", reportDataController.create);
router.put(
    "", 
    async (req, res) => {
        try {
            const model = req.body.model;
            const _id = req.body._id;

            console.log(model)

            if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({
                    error: "Invalid Parameters",
                    msg: "Something went wrong while processing the request. Invalid Id"
                });
            }

            const updatedModel = await ReportDataModel.findOneAndUpdate({ _id: _id }, { data : model }, { new: true });
            console.log(updatedModel)
            return res.json(updatedModel);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                error: 'Server error.',
                details: error 
            }); 
        }
    }
);
router.delete("/:id", reportDataController.delete);
router.post("/save-many", reportDataController.saveMany);
router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const m = await ReportDataModel.find(query).populate(populate)

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