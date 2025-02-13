import mongoose, { Schema } from "mongoose";

const ChartConfigSchema = new mongoose.Schema({
    report_config_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title : {
        type : String,
        required : true
    },
    type : {
        required : true,
        type : String,
        enum : ["Vertical Bar Chart", "Horizontal Bar Chart", "Pie Chart", "Line Chart", "Tabular Presentation"]
    },
    chart_config: {
        type: Object,
        required: true
    },
    include_other_years : {
        type : Boolean,
        default : false
    },
    color_scheme_id : {
        type : Schema.Types.ObjectId,
        required : true
    }
}, { 
    timestamps: true,
    virtuals : true,
    toJSON : { virtuals : true }
});

ChartConfigSchema.virtual("color_scheme", {
    ref : "color_schemes",
    localField : "color_scheme_id",
    foreignField : "_id",
    justOne : true
});


const ChartConfigModel = mongoose.model('chart_configs', ChartConfigSchema);

export default ChartConfigModel;



