import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: false
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
}, {
    timestamps: true
}
);

export const AttendanceModel = mongoose.model("attendance", attendanceSchema);