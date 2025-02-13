import express from "express"
import { createCRUDController } from "../controller/forms/formController.js";

import ChartConfigModel from "../model/ChartConfig.js";

const controller = createCRUDController(ChartConfigModel);


const router = express.Router();

router.get("", controller.getAll);
router.post("", controller.create);
router.put("", controller.update);
router.delete(
    "/:id", 
    controller.delete);
router.post("/save-many", controller.saveMany);
router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const m = await ChartConfigModel.find(query).populate(populate)

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
