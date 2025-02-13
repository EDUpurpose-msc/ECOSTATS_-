import mongoose, { Schema } from "mongoose";

const FieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        required: true,
        // unique: true
    },
    input_type: {
        type: String,
        enum: ['text', 'number', 'date', 'enum'], 
        required : function() {
            return !this.is_nested;
        },
    },
    is_nested : {
        type : Boolean,
        default : false,
        required : true
    },
    values : {
        type : [String],
        required : function() {
            return this.input_type === 'enum';
        }
    },
    editable : {
        type : Boolean,
        default : false,
        required : true
    },
    computed_value : {
        type : Boolean,
        default : false,
        required : function() {
            return this.editable;
        },
    },
    computed_values : {
        type : [String],
        required : function() {
            return this.computed_value;
        }
    },
    computed_value_type : {
        type : String,
        enum : ['sum'],
        default : 'sum',
        required : function() {
            return this.computed_value;
        }
    },
    default : {
        type : String,
        required : function() {
            return !this.is_nested && !this.editable && !this.computed_value;
        },
    },
    children : {
        type : [this],
        required : function() {
            return this.is_nested;
        },
        default : []
    }
}, { timestamps: true });


const ReportConfigSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true
    },
    form_code : { 
        type : String,
        required : true
    },
    sector : {
        type : Schema.Types.ObjectId,
        ref : "sectors",
        required : true
    },
    name: {
        type: String,
        required: true
    },
    fields: {
        type: [FieldSchema], 
        required: true
    }
}, { 
    timestamps: true,
    virtuals : true,
    toJSON : { virtuals : true }
});

ReportConfigSchema.index(
    { identifier : 1, sector : 1 },   
    { unique: true }
);

ReportConfigSchema.virtual("charts", {
    ref: "chart_configs",
    localField: "_id",
    foreignField: "report_config_id"
})

ReportConfigSchema.virtual("data", {
    ref: "report_data",
    localField: "_id",
    foreignField: "report_config_id"
})


const ReportConfigModel = mongoose.model('report_configs', ReportConfigSchema);

export default ReportConfigModel;



