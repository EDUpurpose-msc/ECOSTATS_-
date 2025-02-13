import express from "express"
import { getByQuery } from "../controller/focalPersonController.js";

const router = express.Router()


router.get('/query', getByQuery)



export default router;