import express from "express"
import { 
    addLog,
    approveReport,
    create,
    deleteReport,
    getByQuery,
    getLogsByQuery,
    rejectReport,
    reviewReport
} from "../controller/requestedReportController.js";
import { deleteModel } from "mongoose";


const router = express.Router()

router.post("/create", create);
router.get("/get-by-query", getByQuery);
router.delete("/delete/:id", deleteReport);

router.post("/add-log", addLog);
router.get("/get-logs-by-query", getLogsByQuery);

router.post("/review-report/:id", reviewReport);
router.post("/approve-report/:id", approveReport);
router.post("/reject-report/:id", rejectReport);


export default router;