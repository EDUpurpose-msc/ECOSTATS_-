import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type : String,
        required : [true, "Name is required"]
    },
    email: { 
        type: String, 
        required : true,
        unique: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        required: true,
    },
    verifiedAt : {
        type : Date,
        default : null
    },
    refreshToken : {
        type: String
    },
    role : {
        type : String,
        enum : ["admin", "planning officer", "chief", "focal"]
    },
    deletedAt : {
        type : Date,
        default : null
    }
}, {
    timestamps : true,
    toJSON : {
        virtuals : true
    }
});

UserSchema.virtual("programs", {
    ref : "programs",
    localField : "_id",
    foreignField : "programHead"
});

UserSchema.virtual("units", {
    ref : "units",
    localField : "_id",
    foreignField : "unitHead"
});



const UserModel = model("users", UserSchema);
export default UserModel;