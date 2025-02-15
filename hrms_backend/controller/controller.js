import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import helper from "../helper/helper.js";
import { UserModel } from "../models/userModel.js";
import { AttendanceModel } from "../models/attendanceModel.js";
import { LeaveModel } from "../models/leaveModel.js";

const userSignup = async (req, res) => {
    let { email, name, phone, password, isAdmin, aadharNo, panNo, bankAccountNumber, ifscCode, bankName, emergencyContact, baseSalary, reportingManager, designation, department } = req.body;
    let { userData, fileTimeStamp } = req;
    try {
        try {
            await helper.userSchema.validateAsync(req.body);
        } catch (e) {
            res.status(400).json({ message: e.message + e.details });
            return;
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const adminUser = await UserModel.findOne({ email: reportingManager });
        if (!adminUser) {
            res.status(400).json({ message: "Invalid Reporting Manager" });
            return;
        }
        const newUser = new UserModel({
            email,
            name,
            phone,
            password: await bcryptjs.hash(password, 10),
            isAdmin,
            aadharNo,
            panNo,
            bankAccountNumber,
            ifscCode,
            bankName,
            emergencyContact,
            baseSalary,
            reportingManager: adminUser._id,
            createdBy: userData._id,
            updateBy: userData._id,
            profileImageUrl: `/uploads/${fileTimeStamp}_${req.file.originalname}`,
            designation,
            department
        });
        await newUser.save();
        res.status(201).json({ message: "User Creation Successful" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const userSignin = async (req, res) => {
    const { email, password } = req.body;
    if (!(await helper.loginSchema.validateAsync(req.body))) {
        res.status(400).json({ message: "Invalid Request" });
        return;
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
        res.status(400).json({
            message: "Invalid Username or Password",
        });
        return;
    }
    if (!(await bcryptjs.compare(password, user.password))) {
        res.status(400).json({
            message: "Invalid Username or Password",
        });
        return;
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "23h",
    });
    await UserModel.updateOne(
        {
            _id: user._id,
        },
        {
            $set: {
                token,
            },
        },
    );
    res.status(200).json({ token });
};

const getUserInfo = async (req, res) => {
    const userId = req.userData._id;
    const { userData } = req;
    try {
        const { startOfDay, endOfDay } = helper.getStartAndEndOfTheDay();
        const employeesLeaveList = await LeaveModel.find({ startDate: { $gte: startOfDay }, endDate: { $lte: endOfDay } });
        const { startOfMonth, endOfMonth } = helper.getStartAndEndOfMonth();
        const userAttendanceList = await AttendanceModel.find({ userId: userId, checkIn: { $gte: startOfMonth, $lte: endOfMonth } });
        const totalUserCount = await UserModel.countDocuments();
        const leavesTakenThisMonth = await LeaveModel.countDocuments({ userId: userId, createdAt: { $gte: startOfMonth, $lt: endOfMonth } });
        const isCheckedIn = await AttendanceModel.findOne({ userId: userId, checkIn: { $gte: startOfDay, $lt: endOfDay } });
        res.status(200).json({
            message: "User Info Fetched Successfully",
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            aadharNo: userData.aadharNo,
            panNo: userData.panNo,
            bankAccountNumber: userData.bankAccountNumber,
            ifscCode: userData.ifscCode,
            bankName: userData.bankName,
            emergencyContact: userData.emergencyContact,
            baseSalary: userData.baseSalary,
            salaryPayable: (userData.baseSalary / helper.getWeekdaysInMonth(new Date().getFullYear(), new Date().getMonth())) * userAttendanceList.length,
            reportingManager: userData.reportingManager,
            totalEmployees: totalUserCount,
            totalEmployeesPresent: totalUserCount - employeesLeaveList.length,
            totalEmployeesLeave: employeesLeaveList.length,
            leavesTakenThisMonth: leavesTakenThisMonth,
            profileImageUrl: userData.profileImageUrl,
            checkedIn: isCheckedIn ? true : false,
            checkedOut: isCheckedIn ? isCheckedIn.checkOut ? true : false : false,
            isAdmin: userData.isAdmin
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const userCheckIn = async (req, res) => {
    const userId = req.userData._id;
    try {
        const { startOfDay, endOfDay } = helper.getStartAndEndOfTheDay();
        const isCheckedIn = await AttendanceModel.findOne({ userId: userId, checkIn: { $gte: startOfDay, $lt: endOfDay } });
        if (isCheckedIn) {
            res.status(400).json({ message: "User Already Checked In" });
            return;
        }
        const newAttendance = new AttendanceModel({
            userId,
            checkIn: new Date(),
            createdBy: userId,
            updateBy: userId
        });
        await newAttendance.save();
        res.status(201).json({ message: "User Checked In Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const userCheckOut = async (req, res) => {
    const userId = req.userData._id;
    try {
        const { startOfDay, endOfDay } = helper.getStartAndEndOfTheDay();
        const isCheckedIn = await AttendanceModel.findOne({ userId: userId, checkIn: { $gte: startOfDay, $lt: endOfDay } });
        if (!isCheckedIn) {
            res.status(400).json({ message: "User Not Checked In" });
            return;
        }
        await AttendanceModel.updateOne({ _id: isCheckedIn._id }, { $set: { checkOut: new Date() } });
        res.status(200).json({ message: "User Checked Out Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getLeavesData = async (req, res) => {
    const userId = req.userData._id;
    try {
        const leaves = await LeaveModel.find({ userId: userId });
        res.status(200).json({ leaves });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createLeave = async (req, res) => {
    const userId = req.userData._id;
    const { type, startDate, endDate, reason } = req.body;
    try {
        const leave = new LeaveModel({
            userId,
            userName: req.userData.name,
            department: req.userData.department,
            designation: req.userData.designation,
            startDate,
            endDate,
            description: reason,
            type,
            createdBy: userId,
            updateBy: userId,
            actionUserId: req.userData.reportingManager,
            status: "Pending"
        });
        await leave.save();
        res.status(201).json({ message: "Leave Application Created Successfully", leave });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getLeavesForAction = async (req, res) => {
    const userId = req.userData._id;
    try {
        const leaves = await LeaveModel.find({ actionUserId: userId, status: "Pending" });
        res.status(200).json({ leaves });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const leaveAction = async (req, res) => {
    const { status, leaveId } = req.body;
    try {
        await LeaveModel.updateOne({ _id: leaveId }, { $set: { status } });
        res.status(200).json({ message: "Leave Action Updated Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllEmployees = async (req, res) => {
    try {
        let employees = await UserModel.find({}, { _id: 1, name: 1, email: 1, phone: 1, profileImageUrl: 1, department: 1, designation: 1 });
        employees = employees.filter(employee => employee.email !== "sourashis@hrms.ai");
        res.status(200).json({ employees });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export default { userSignup, userSignin, getUserInfo, userCheckIn, userCheckOut, getLeavesData, createLeave, getLeavesForAction, leaveAction, getAllEmployees };