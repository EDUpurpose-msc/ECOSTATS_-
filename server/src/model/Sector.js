import mongoose, { Schema } from "mongoose";

const SectorSchema = new mongoose.Schema({
    calendar_year : {
        type : Number,
        required : true
    },
    identifier: {
        type: String,
        required: true
    },
    name : {
        type : String,
        required : true
    },
}, { 
    timestamps: true,
    virtuals : true,
    toJSON : { virtuals : true }
});

SectorSchema.index(
    { calendar_year: 1, identifier : 1 },   
    { unique: true }
);

SectorSchema.virtual("configs", {
    ref : "report_configs",
    localField : "_id",
    foreignField : "sector"
});

SectorSchema.virtual("programs", {
    ref : "programs",
    localField : "_id",
    foreignField : "sector_id",
    justOne : false
});

SectorSchema.virtual("classification", {
    ref : "classifications",
    localField : "_id",
    foreignField : "sector_id",
    justOne : true
});

const SectorModel = mongoose.model('sectors', SectorSchema);

export default SectorModel;



