import express from "express"
import { createCRUDController } from "../controller/forms/formController.js";
import mongoose from "mongoose";

import ReportConfigModel from "../model/ReportConfig.js";
import ReportDataModel from "../model/ReportData.js";

const reportConfigController = createCRUDController(ReportConfigModel);


const router = express.Router();

router.get("", reportConfigController.getAll);
router.post("", reportConfigController.create);
router.put("", reportConfigController.update);
router.delete(
    "/:id", 
    async(req, res, next) => {
        try {
            const id = req.params.id;
            if(await ReportDataModel.exists({ report_config_id : id })){
                return res.status(400).json({
                    error: "Invalid Parameters",
                    msg: "Unable to delete this configuration because it already has associated report data. Please update or delete the associated report data first."
                });
            }
            next();
        } catch (error) {
            return res.status(500).json(
                { 
                    error: 'Server error.',
                    msg : "An unexpected error occurred while processing the request. Please contact the system administrator to try fixing the problem."
                }   
            );
        }
    },
    reportConfigController.delete);
router.post("/save-many", reportConfigController.saveMany);
router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);
        
        
        const m = await ReportConfigModel.find(query).populate(populate)

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
router.put("/update-field",
    async (req, res) => {
        try {
            const { report_config_id, updatedData, identifier } = req.body;
            const reportConfig = await ReportConfigModel.findOne({ _id: report_config_id });
            console.log(updatedData, identifier)
            if (!reportConfig) {
                return res.status(404).json({
                    error: "Invalid Parameters",
                    msg: "Cant find the report configurations."
                });
            }

            // Recursive function to locate and update the nested field by _id
            function findAndUpdateField(fields) {
                for (let field of fields) {
                    // Check if this field's _id matches
                    if (field.identifier == identifier) {
                        console.log("field", field);
                        Object.assign(field, updatedData); // Update the field with new data
                        console.log("updated field", field);
                        return true; // Field found and updated
                    }

                    // If it has children, recursively search within them
                    if (field.is_nested && field.children && field.children.length > 0) {
                        const found = findAndUpdateField(field.children);
                        if (found) return true; // Stop searching once field is found
                    }
                }
                return false; // Field not found
            }

            // Update the field if it exists in the nested structure
            
            const fieldUpdated = findAndUpdateField(reportConfig.fields);
            if (!fieldUpdated) {
                return res.status(404).json({
                    error: "Not Found",
                    msg: "Error, field was not found"
                });
            }

            // Save the updated document
            // console.log("updated config", reportConfig);
            reportConfig.markModified('fields');
            await reportConfig.save();
            console.log("updated already")
            return res.json(reportConfig);
        } catch (error) {
            return res.status(500).json(
                { 
                    error: 'Server error.',
                    details : error
                }   
            ); 
        }
    }
);
router.delete("/fields/delete",
    async (req, res) => {
        try {
            const { report_config_id, identifier } = req.query;
            const reportConfig = await ReportConfigModel.findOne({ _id: report_config_id }).populate("data")
            
            if(reportConfig.data.length > 0){
                return res.status(400).json({
                    error: "Request Error",
                    msg: "Cannot delete the fields as there are already data entries associated with this report configuration. Please delete or update the report data entries first."
                });
            }
            
            if (!reportConfig) {
                return res.status(404).json({
                    error: "Invalid Parameters",
                    msg: "Cannot find the report configurations."
                });
            }
    
            // Recursive function to locate and delete the nested field by identifier
            function findAndDeleteField(fields) {
                for (let field of fields) {
                    // Check if this field's identifier matches
                    if (field.identifier === identifier) {
                        // Remove the field (in case it's found in the current level)
                        const index = fields.indexOf(field);
                        if (index !== -1) {
                            fields.splice(index, 1); // Remove the field from the array
                            return true;
                        }
                    }
    
                    // If it has children, recursively search within them
                    if (field.is_nested && field.children && field.children.length > 0) {
                        const found = findAndDeleteField(field.children);
                        if (found) return true; // Stop searching once field is found and deleted
                    }
                }
                return false; // Field not found
            }
    
            // Delete the field if it exists in the nested structure
            const fieldDeleted = findAndDeleteField(reportConfig.fields);
    
            if (!fieldDeleted) {
                return res.status(404).json({
                    error: "Not Found",
                    msg: "Error, field was not found"
                });
            }
    
            // Mark the fields array as modified to ensure Mongoose detects the deletion
            reportConfig.markModified('fields');
    
            // Save the updated document
            await reportConfig.save();
            return res.json(reportConfig);
        } catch (error) {
            return res.status(500).json({
                error: 'Server error.',
                details: error
            });
        }
    }
);
router.post("/fields/insert", 
    async (req, res) => {
        try {
            const { report_config_id, newField, position_identifier, position } = req.body;
            const reportConfig = await ReportConfigModel.findOne({ _id: report_config_id });

            console.log(position_identifier);

            if (!reportConfig) {
                return res.status(404).json({
                    error: "Invalid Parameters",
                    msg: "Cannot find the report configurations."
                });
            }
    
            // Recursive function to locate the parent field and insert the new field
            function findAndInsertField(fields) {
                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i];
    
                    // Check if this field's identifier matches
                    if (field.identifier === position_identifier) {
                        // Determine the correct index to insert (before or after)
                        if (position === "before") {
                            // Insert new field before the identified field
                            fields.splice(i, 0, newField); // Insert at the current index
                        } else if (position === "after") {
                            // Insert new field after the identified field
                            fields.splice(i + 1, 0, newField); // Insert at the next index
                        }
                        return true; // Stop searching once the field is inserted
                    }
    
                    // If it has children, recursively search within them
                    if (field.is_nested && field.children && field.children.length > 0) {
                        const found = findAndInsertField(field.children);
                        if (found) return true; // Stop searching once field is inserted
                    }
                }
                return false; // Field not found
            }
    
            // Insert the new field if it exists in the nested structure
            const fieldInserted = findAndInsertField(reportConfig.fields);
    
            if (!fieldInserted) {
                return res.status(404).json({
                    error: "Not Found",
                    msg: "Error, field was not found"
                });
            }
    
            // Mark the fields array as modified to ensure Mongoose detects the insertion
            reportConfig.markModified('fields');
    
            // Save the updated document
            await reportConfig.save();
            return res.json(reportConfig);
        } catch (error) {
            return res.status(500).json({
                error: 'Server error.',
                details: error
            });
        }
    }
);

export default router;
