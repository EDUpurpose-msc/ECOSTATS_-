import express from "express"
import { createCRUDController } from "../controller/forms/formController.js";
import ReportConfigModel from "../model/ReportConfig.js";
import mongoose from "mongoose";

import SectorModel from "../model/Sector.js";
import ChartConfigModel from "../model/ChartConfig.js";
import RequestedReportModel from "../model/RequestedReport.js";
import UserModel from "../model/User.js";

const sector = createCRUDController(SectorModel);


const router = express.Router();

router.get("", sector.getAll);
router.post("", sector.create);
router.put("", sector.update);
router.delete(
    "/:id", 
    async(req, res, next) => {
        try {
            const id = req.params.id;
            if(await ReportConfigModel.exists({ sector : id })){
                return res.status(400).json({
                    error: "Invalid Parameters",
                    msg: "Unable to delete this sector because it is already being used by existing report configurations. Please update or delete the associated report configurations first."
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
    sector.delete
);
router.post("/save-many", sector.saveMany);
router.get("/by-query", async (req, res) => {
    try {
        
        const query = JSON.parse(req.query.query);
        const populate = JSON.parse(req.query.populate);

        const m = await SectorModel.find(query).populate(populate)

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

router.post("/copy-all-sector-configs", async (req, res) => {
    const { base_on, for_year } = req.body;
    
    if (!base_on || !for_year || base_on === for_year) {
        return res.status(400).json({
            error: "Invalid Parameters",
            msg: `Invalid or duplicate years provided. Base year: ${base_on}, For year: ${for_year}`,
        });
    }

    const session = await mongoose.startSession(); // Start a session for transactions
    session.startTransaction();
    try {

        // Step 1: Fetch all sectors for the base year
        const oldSectors = await SectorModel.find({ calendar_year: base_on }).session(session);

        if (oldSectors.length <= 0) {
            return res.status(404).json({
                error: "Not Found",
                msg: `No sectors found for the specified base year: ${base_on}`,
            });
        }

        const newSectorConfigs = [];

        console.log("working")
        

        // Step 2: Duplicate each sector and its configurations
        for (const oldSector of oldSectors) {
            // Create the new sector for the target year
            const newSector = await SectorModel.create(
                [{
                    calendar_year: for_year,
                    identifier: oldSector.identifier, // Retain the same identifier
                    name: oldSector.name,            // Retain the same name
                }],
                { session }
            );

            // Fetch configurations for the old sector
            const oldConfigs = await ReportConfigModel.find({ sector: oldSector._id }).session(session);

            if (!oldConfigs.length) {
                console.warn(`No configurations found for sector: ${oldSector.identifier}`);
                continue;
            }

            // Step 3: Duplicate configurations and their associated charts
            const newConfigs = await Promise.all(
                oldConfigs.map(async (config) => {
                    const newConfigData = {
                        ...config.toObject(),
                        sector: newSector[0]._id, // Associate with the new sector
                    };
                    delete newConfigData._id;
                    delete newConfigData.createdAt;
                    delete newConfigData.updatedAt;

                    const createdConfig = await ReportConfigModel.create([newConfigData], { session });

                    // Copy associated charts
                    const oldCharts = await ChartConfigModel.find({ report_config_id: config._id }).session(session);
                    const newCharts = await Promise.all(
                        oldCharts.map(async (chart) => {
                            const newChartData = {
                                ...chart.toObject(),
                                report_config_id: createdConfig[0]._id, // Associate with the new config
                            };
                            delete newChartData._id;
                            delete newChartData.createdAt;
                            delete newChartData.updatedAt;

                            return await ChartConfigModel.create([newChartData], { session });
                        })
                    );

                    return { config: createdConfig[0], charts: newCharts };
                })
            );

            newSectorConfigs.push({ newSector: newSector[0], newConfigs });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Sectors, configurations, and charts copied successfully.",
            data: newSectorConfigs,
        });
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

router.get("/get-charts-count-by-sectors", async (req, res) => {
    try {
        const year = req.query.year;

        // return res.json(year);

        const result = await SectorModel.aggregate([
            {
              $match: {
                calendar_year: parseInt(year),
              },
            },
            {
              $lookup: {
                from: "report_configs", 
                localField: "_id", 
                foreignField: "sector", 
                as: "report_configs",
              },
            },
            {
              $unwind: {
                path: "$report_configs",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "chart_configs", 
                localField: "report_configs._id", 
                foreignField: "report_config_id", 
                as: "charts",
              },
            },
            {
              $group: {
                _id: "$_id", 
                sector_name: { $first: "$name" }, 
                chartCount: { $sum: { $size: "$charts" } }, 
              },
            },
            {
              $project: {
                _id: 1,
                sector_name: 1,
                chartCount: 1,
              },
            },
          ]);

        return res.json(result);

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

router.get("/get-top-reports-by-chart-count", async (req, res) => {
    try {

        const calendarYear = req.query.year; // Replace with the desired year


        const topReports = await ReportConfigModel.aggregate([
            // Lookup the associated sector for each report config
            {
                $lookup: {
                    from: "sectors", // The sectors collection
                    localField: "sector", // The sector reference in report_configs
                    foreignField: "_id", // The _id in sectors
                    as: "sectorDetails",
                },
            },
            // Filter by calendar_year in the associated sector
            {
                $match: {
                    "sectorDetails.calendar_year": parseInt(calendarYear),
                },
            },
            // Lookup charts for each report config
            {
                $lookup: {
                    from: "chart_configs", // The chart config collection
                    localField: "_id", // The field in report configs
                    foreignField: "report_config_id", // The field in chart configs
                    as: "charts",
                },
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$charts" }, 0] },
                },
            },
            // Project report details and the count of associated charts
            {
                $project: {
                    _id: 1,
                    name: 1, // Report name
                    form_code: 1, // Additional info if needed
                    sector: 1, // Sector reference
                    chartCount: { $size: "$charts" }, // Count the number of charts
                },
            },
            // Sort by chart count in descending order
            {
                $sort: { chartCount: -1 },
            },
            // Limit to the top 10
            {
                $limit: 10,
            },
        ]);

        return res.json(topReports);

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

router.get("/get-reports-overview-data", async (req, res) => {
    try {
        const year = req.query.year;

        const sectors = await SectorModel.find({ calendar_year: year });
        const sectorIds = sectors.map((sector) => sector._id);

        const totalForms = await ReportConfigModel.countDocuments({ sector: { $in: sectorIds } });
        const reportIds = await ReportConfigModel.distinct("_id", { sector: { $in: sectorIds } });
        const approvedReports = await RequestedReportModel.countDocuments({ report_config_id: { $in: reportIds }, approved_at: { $ne: null }, rejected_by: null });
        const pendingReports = await RequestedReportModel.countDocuments({ report_config_id: { $in: reportIds }, approved_at: null, rejected_by: null });

        const reportsBySectorData = await SectorModel.aggregate([
            // Lookup report configs for each sector
            {
                $lookup: {
                    from: "report_configs", // The report_configs collection
                    localField: "_id", // The _id field in sectors
                    foreignField: "sector", // The sector reference in report_configs
                    as: "reportDetails",
                },
            },
            // Filter by calendar_year in the sectors collection
            {
                $match: {
                    calendar_year: parseInt(year), // Ensure sectors match the specified year
                },
            },
            // Project the report count
            {
                $project: {
                    _id: 1,
                    sector_name: "$name", // Include the sector name
                    report_count: { $size: "$reportDetails" }, // Count the number of associated report configs
                },
            },
            // Sort by report count (if needed)
            {
                $sort: { report_count: -1 },
            },
        ]);

        

        return res.json({
            totalForms,
            approvedReports,
            pendingReports,
            reportsBySectorData
        })


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

router.get("/get-home-overview-data", async (req, res) => {
    try {
        const year = req.query.year;

        const sectors = await SectorModel.find({ calendar_year: year });
        const sectorIds = sectors.map((sector) => sector._id);

        const totalForms = await ReportConfigModel.countDocuments({ sector: { $in: sectorIds } });
        const reportIds = await ReportConfigModel.distinct("_id", { sector: { $in: sectorIds } });
        const approvedReports = await RequestedReportModel.countDocuments({ report_config_id: { $in: reportIds }, approved_at: { $ne: null }, rejected_by: null });
        const pendingReports = await RequestedReportModel.countDocuments({ report_config_id: { $in: reportIds }, approved_at: null, rejected_by: null });
        const totalUsers = await UserModel.countDocuments({deletedAt: null});
        const activeUsers = await UserModel.countDocuments({isActive: true});
        const inactiveUsers = await UserModel.countDocuments({isActive: false});
        const recentUsers = await UserModel.find({deletedAt: null}).sort({createdAt: -1}).limit(5);

        const reportsBySectorData = await SectorModel.aggregate([
            // Lookup report configs for each sector
            {
                $lookup: {
                    from: "report_configs", // The report_configs collection
                    localField: "_id", // The _id field in sectors
                    foreignField: "sector", // The sector reference in report_configs
                    as: "reportDetails",
                },
            },
            // Filter by calendar_year in the sectors collection
            {
                $match: {
                    calendar_year: parseInt(year), // Ensure sectors match the specified year
                },
            },
            // Project the report count
            {
                $project: {
                    _id: 1,
                    sector_name: "$name", // Include the sector name
                    report_count: { $size: "$reportDetails" }, // Count the number of associated report configs
                },
            },
            // Sort by report count (if needed)
            {
                $sort: { report_count: -1 },
            },
        ]);

        const chartsBySectorData = await SectorModel.aggregate([
            {
              $match: {
                calendar_year: parseInt(year),
              },
            },
            {
              $lookup: {
                from: "report_configs", 
                localField: "_id", 
                foreignField: "sector", 
                as: "report_configs",
              },
            },
            {
              $unwind: {
                path: "$report_configs",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "chart_configs", 
                localField: "report_configs._id", 
                foreignField: "report_config_id", 
                as: "charts",
              },
            },
            {
              $group: {
                _id: "$_id", 
                sector_name: { $first: "$name" }, 
                chartCount: { $sum: { $size: "$charts" } }, 
              },
            },
            {
              $project: {
                _id: 1,
                sector_name: 1,
                chartCount: 1,
              },
            },
            {
              $sort: {
                chartCount: -1,
              },
            }
        ]);

          const chartsCount = await ChartConfigModel.countDocuments({
            report_config_id: {
              $in: reportIds,
            },
          });

        

        return res.json({
            totalForms,
            approvedReports,
            pendingReports,
            reportsBySectorData,
            chartsBySectorData,
            chartsCount,
            totalUsers,
            activeUsers,
            inactiveUsers,
            recentUsers
        });


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
