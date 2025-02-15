import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    aadharNo: {
        type: String,
        required: true
    },
    panNo: {
        type: String,
        required: true
    },
    bankAccountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    baseSalary: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        required: true
    },
    reportingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    token: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const UserModel = mongoose.model("user", userSchema);



