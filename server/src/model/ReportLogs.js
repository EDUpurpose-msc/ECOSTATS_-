import mongoose, { Schema } from 'mongoose'; // Using ES6 import syntax

const ReportLogSchema = new mongoose.Schema({
  message : {
    type : String,
    required : true
  },
  comment : {
    type : String,
    default : null
  },
  reportId : {
    type : Schema.Types.ObjectId,
    required : true,
    ref: "requested_reports"
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create a model
const ReportLogModel = mongoose.model('report_log', ReportLogSchema);

export default ReportLogModel;
