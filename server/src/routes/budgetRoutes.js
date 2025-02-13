import express from "express"
import Budget from "../model/Budget.js";
import { createCRUDController } from "../controller/forms/formController.js";


const router = express.Router()

const budgetController = createCRUDController(Budget);

router.get("", budgetController.getAll);
router.post("", budgetController.create);
router.put("", budgetController.update);
router.delete("/:id", budgetController.delete);
router.post("/save-many", budgetController.saveMany);
router.get("/by-query", budgetController.getByQuery);

export default router;