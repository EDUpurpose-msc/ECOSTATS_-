import { Schema, model } from "mongoose";

const ClassificationSchema = new Schema({
    sector_id : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    classifications : {
        type : [Object],
        required : true
    }
}, {
    timestamps : true,
    toJSON : {
        virtuals : true
    }
});


const ClassificationModel = model("classifications", ClassificationSchema);
export default ClassificationModel;