import { Router } from "express";
import controller from "./controller/controller.js";
import { isUser } from "./middleware/isUser.js";
import { isAdminUser } from "./middleware/isAdmin.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        req.fileTimeStamp = timestamp;
        cb(null, `${timestamp}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

//User Routes
const userRouter = Router();
{

}

//Admin Routes
const adminRouter = Router();
{
    adminRouter.post("/createuser", upload.single("image"), controller.userSignup);
    adminRouter.get("/leavesforaction", controller.getLeavesForAction);
    adminRouter.post("/leaveaction", controller.leaveAction);
}

//Common Routes
const router = Router();
{
    router.use("/user", isUser, userRouter);
    router.use("/admin", isAdminUser, adminRouter);
    router.post("/login", controller.userSignin);
    router.get("/userinfo", isUser, controller.getUserInfo);
    router.get("/checkin", isUser, controller.userCheckIn);
    router.get("/checkout", isUser, controller.userCheckOut);
    router.get("/leavedata", isUser, controller.getLeavesData);
    router.post("/createleave", isUser, controller.createLeave);
    router.get("/allemployees", isUser, controller.getAllEmployees);
}

export default router;