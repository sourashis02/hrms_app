//joi schema
import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(8).max(30).required(),
    isAdmin: Joi.boolean().required(),
    aadharNo: Joi.string().pattern(/^[0-9]{12}$/).required(),
    panNo: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
    bankAccountNumber: Joi.string().required(),
    ifscCode: Joi.string().required(),
    bankName: Joi.string().required(),
    emergencyContact: Joi.string().pattern(/^[0-9]{10}$/).required(),
    baseSalary: Joi.number().min(0).required(),
    reportingManager: Joi.string().required(),
    designation: Joi.string().required(),
    department: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
});

const getWeekdaysInMonth = (year, month) => {
    let count = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const weekday = new Date(year, month, day).getDay();
        if (weekday >= 1 && weekday <= 5) {
            count++;
        }
    }

    return count;
}

const getStartAndEndOfMonth = () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    return { startOfMonth, endOfMonth };
}

const getStartAndEndOfTheDay = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
}

export default {
    userSchema,
    loginSchema,
    getWeekdaysInMonth,
    getStartAndEndOfMonth,
    getStartAndEndOfTheDay
}