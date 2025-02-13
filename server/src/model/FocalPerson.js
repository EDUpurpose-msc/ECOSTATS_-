import { Mongoose, Schema, model } from "mongoose";

const FocalPersonSchema = new Schema({
    unitId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "units"
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "users"
    },
    position : {
        type : String,
        required : true
    },
    deletedAt : {
        type : Date,
        default : null
    }
}, {
    timestamps : true
});

const FocalPersonModel = model("focal_person", FocalPersonSchema);
export default FocalPersonModel;