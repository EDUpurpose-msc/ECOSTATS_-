
import mongoose from "mongoose";
import RequestedReportModel from "../model/RequestedReport.js";
import ReportLogModel from "../model/ReportLogs.js";
import UserModel from "../model/User.js"
import FocalPerson from "../model/FocalPerson.js"
import { getUserFromToken, getUserIdFromToken } from "./userController.js";
import { populate } from "dotenv";

export const create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {

        const { title, description, filters, fields, requested_by, isCustom, report_config_id } = req.body;

        const focal = await FocalPerson.findOne({
            userId :requested_by,
            deletedAt : null
        }).session(session);

        if(!focal) {
            return res.status(404).json({
                error: "Unit Not Found",
                msg: "Unable to create the report as this user is not a member of any unit."
            })
        }

        console.log({
            title,
            description,
            filters : filters || {},
            fields,
            requested_by,
            isCustom,
            unit_id : focal.unitId,
            report_config_id : report_config_id
        });
        
        const requestedReport = new RequestedReportModel({
            title,
            description,
            filters : filters || {},
            fields,
            requested_by,
            isCustom,
            unit_id : focal.unitId,
            report_config_id : report_config_id
        });
        await requestedReport.save({session});
        console.log(requestedReport._id)

        const user = await UserModel.findById(requested_by).session(session);

        await new ReportLogModel({
            message : `${user.name} created the request.`,
            reportId : requestedReport._id
        }).save({session});
        
        
        await session.commitTransaction();
        return res.send();
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    } finally {
        session.endSession()
    }
}

export const getByQuery = async (req, res) => {
    try {
        const query = JSON.parse(req.query.query);
        const populate =  JSON.parse(req.query.populate);

        console.log(query)
        let request;
        if(populate) {
            request = await RequestedReportModel.find(query).populate(populate);
        }
        else {
            request = await RequestedReportModel.find(query);
        }

        return res.json(request);

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

export const deleteReport = async (req, res) => {
    try {
        const id = req.params.id;

        await RequestedReportModel.deleteOne({_id : id});

        return res.json();

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

export const addLog = async (req, res) => {
    try {

        const { reportId, comment, message } = req.body;

        const reportLog = new ReportLogModel({
            reportId,
            comment,
            message
        });
        await reportLog.save()
        
        return res.send();
    } catch (error) {
        console.log(error)
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    } 
}

export const getLogsByQuery = async (req, res) => {
    try {
        const query = JSON.parse(req.query.query);
        const populate =  JSON.parse(req.query.populate);

        let request;
        if(populate) {
            request = await ReportLogModel.find(query).populate(populate).sort({createdAt : "descending"});
        }
        else {
            request = await ReportLogModel.find(query).sort({createdAt : "descending"});
        }

        return res.json(request);

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

export const reviewReport = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const user = await getUserFromToken(req.cookies.accessToken);
        const id = req.params.id;

        await RequestedReportModel.findOneAndUpdate(
            {_id : id},
            {
                reviewed_at : Date.now()
            }
        ).session(session);

        const log = new ReportLogModel({
            message : `${user.name} reviewed the report.`,
            reportId : id
        });
        await log.save({session});
        
        await session.commitTransaction();
        return res.json();

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    } finally {
        await session.endSession();
    }
}

export const approveReport = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const user = await getUserFromToken(req.cookies.accessToken);
        const id = req.params.id;

        await RequestedReportModel.findOneAndUpdate(
            {_id : id},
            {
                approved_at : Date.now()
            }
        ).session(session);

        const log = new ReportLogModel({
            message : `${user.name} approved the report.`,
            reportId : id
        });
        await log.save({session});
        
        await session.commitTransaction();
        return res.json();

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    } finally {
        await session.endSession();
    }
}

export const rejectReport = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const user = await getUserFromToken(req.cookies.accessToken);
        const id = req.params.id;

        console.log(user)
        await RequestedReportModel.findOneAndUpdate(
            {_id : id},
            {
                rejected_by : user._id
            }
        ).session(session);

        const log = new ReportLogModel({
            message : `${user.name} rejected the report.`,
            reportId : id
        });
        await log.save({session});
        
        await session.commitTransaction();
        return res.json();

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    } finally {
        await session.endSession();
    }
}

export const countToApproveReportByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = UserModel.findById(userId).populate(["units", "programs"]);

        // const units = 
        
    } catch (error) {
        console.log(error)
        res.status(500).json(
            { 
                error: 'Server error',
                details : error
            }   
        );
    } 
}

