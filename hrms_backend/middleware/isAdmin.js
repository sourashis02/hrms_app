import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

export const isAdminUser = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({
            title: "Invalid Request",
            message: "Please Check the Request Header Token Mismatch",
        });
        return;
    }
    if (!authorization.startsWith("Bearer ")) {
        res.status(401).json({
            title: "Invalid Request",
            message: "Hearder not Started with bearer",
        });
        return;
    }
    const token = authorization.replace("Bearer ", "");
    let result;
    try {
        result = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
        res.status(401).json({
            status: "FAILURE",
            message: "Token Validation Failed! Invalid Token",
        });
        return;
    }
    if (!result) {
        res.status(401).json({
            title: "Token Mismatch",
            message: "Please Check the Request Header Token Mismatch",
        });
        return;
    }
    let user = await UserModel.findOne({ _id: result.id });
    if (!user) {
        res.status(401).json({
            title: "Invalid Request",
            message: "User Not Exists in Database",
        });
        return;
    }
    if (user.token !== token) {
        res.status(401).json({
            title: "Token Mismatch in Database",
            message: "Please Check the Request Header Token Mismatch",
        });
        return;
    }
    if (!user.isAdmin) {
        res.status(401).json({
            title: "Invalid Request",
            message: "You are not an Admin",
        });
        return;
    }
    req.userData = user;
    next();
};