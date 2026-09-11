import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createProductInspection,
    getAllProducts,
    getProductById,
    verifyInspectionFinding,
    getDashboardStats,
    getRulesCatalog,
    downloadProductReport,
    correctProductDeclaration,
    calibrateInspectionScale
} from "../controllers/product.controller.js";

const router = Router();

// Publicly readable rules catalog (can be accessed unauthenticated or authenticated)
router.route("/rules/catalog").get(getRulesCatalog);

// Protect all other inspection routes with JWT verification
router.use(verifyJWT);

// Dashboard aggregate statistics from real DB
router.route("/stats").get(getDashboardStats);

// Inspection CRUD routes
router.route("/")
    .post(upload.array("images", 5), createProductInspection)
    .get(getAllProducts);

router.route("/:id").get(getProductById);
router.route("/:id/verify").patch(verifyInspectionFinding);
router.route("/:id/correct").patch(correctProductDeclaration);
router.route("/:id/calibrate").post(calibrateInspectionScale);
router.route("/:id/report").get(downloadProductReport);

export default router;

