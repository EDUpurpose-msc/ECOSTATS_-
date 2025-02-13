import { Schema, model } from "mongoose";

const UnitSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    programId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "programs"
    },
    description : {
        type : String
    },  
    deletedAt : {
        type : Date,
        default : null
    },
    unitHead : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required : true
    }
},
{
    timestamps  : true
});



const UnitModel = model("units", UnitSchema);
export default UnitModel;