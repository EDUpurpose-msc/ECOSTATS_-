import mongoose, { Schema } from "mongoose";

const ColorSchemeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    colors : {
        type : [String],
        required : true
    }
}, { 
    timestamps: true,
    virtuals : true,
    toJSON : { virtuals : true }
});


const ColorSchemeModel = mongoose.model('color_schemes', ColorSchemeSchema);

export default ColorSchemeModel;



