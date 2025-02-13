import mongoose, { Schema } from 'mongoose'; // Using ES6 import syntax

const RequestedReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
    default : null
  },
  filters: {
    type: Object,
    required : true
  },
  fields: {
    type: [Object],
    required : true
  },
  form_name : {
    type : String
  },
  report_config_id : {
    type : Schema.Types.ObjectId,
    required : true,
    ref : "report_configs"
  },
  unit_id : {
    type : Schema.Types.ObjectId,
    required : true,
    ref: "units"
  },
  requested_by: {
    type: Schema.Types.ObjectId,
    ref : "users",
    required : true
  },
  reviewed_at : {
    type : Date,
    default : null
  },
  approved_at : {
    type : Date,
    default : null
  },
  rejected_by : {
    type : Schema.Types.ObjectId,
    default : null,
    ref : "users"
  },
  isCustom : {
    type : Boolean,
    default : true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  virtuals : true,
  toJSON : { virtuals : true }
});

RequestedReportSchema.virtual("config", {
    ref : "report_configs",
    localField : "report_config_id",
    foreignField : "_id",
    justOne : true
});

// Create a model
const RequestedReportModel = mongoose.model('requested_reports', RequestedReportSchema);

export default RequestedReportModel;
