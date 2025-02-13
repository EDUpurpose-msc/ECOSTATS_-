import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    calendar_year: {
        type: Number,
        required: true,
        unique : true
    },
    land : {
        type: Number,
        required : true,
        min : 0
    },
    biodiversity : {
        type: Number,
        required : true,
        min : 0
    },
    forestry : {
        type: Number,
        required : true,
        min : 0
    },
    land_manpower : {
        type: Number,
        required : true,
        min : 0
    },
    forestry_manpower : {
        type: Number,
        required : true,
        min : 0
    },
    biodiversity_manpower : {
        type: Number,
        required : true,
        min : 0
    },
    total : {
        type: Number,
        required : true,
        min : 0
    },
    
}, { timestamps: true });


const Budget = mongoose.model('budget', BudgetSchema);

export default Budget;
