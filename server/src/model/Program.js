import { Schema, model } from "mongoose";

const ProgramSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String
    },  
    deletedAt : {
        type : Date,
        default: null
    },
    programHead : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    sector_id : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "sectors"
    }
},
{
    timestamps  : true,
    toJSON : {
        virtuals : true
    }
});

ProgramSchema.virtual("sector", {
    ref : "sectors",
    localField : "sector_id",
    foreignField : "_id",
    justOne : true
})

ProgramSchema.virtual("units", {
    ref : "units",
    localField : "_id",
    foreignField : "programId",
    justOne : false
})

// Create a compound index to enforce unique name where deletedAt is null
ProgramSchema.index({ name: 1, deletedAt: 1, sector_id: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });


const ProgramModel = model("programs", ProgramSchema);
export default ProgramModel;