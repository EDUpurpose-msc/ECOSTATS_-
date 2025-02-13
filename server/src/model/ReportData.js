import mongoose, { Schema } from "mongoose";

const ReportDataSchema = new mongoose.Schema({
    report_config_id : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "report_configs"
    },
    data : {
        type : Object,
        required : true
    }
}, {
    timestamps: true
});

const ReportDataModel = mongoose.model("report_data", ReportDataSchema);

export default ReportDataModel;