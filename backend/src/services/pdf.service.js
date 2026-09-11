// import { spawn } from "child_process";
// import path from "path";
// import fs from "fs";
// import { ApiError } from "../utils/ApiError.js";
// import { resolvePythonExecutable, resolveOcrPaths } from "./pythonEnv.js";

// export const generateProductReportPdf = (product, user) => {
//     return new Promise((resolve, reject) => {
//         if (!product) {
//             return reject(new ApiError(400, "Inspection product data is required for PDF report generation"));
//         }

//         const tempDir = path.resolve(process.cwd(), "public/temp");
//         if (!fs.existsSync(tempDir)) {
//             fs.mkdirSync(tempDir, { recursive: true });
//         }

//         const timestamp = Date.now();
//         const payloadPath = path.join(tempDir, `payload_${product.inspectionId}_${timestamp}.json`);
//         const pdfOutputPath = path.join(tempDir, `LabelGuard_Report_${product.inspectionId}_${timestamp}.pdf`);

//         const backendRoot = process.cwd();

//         const payload = {
//             inspectionId: product.inspectionId,
//             createdAt: product.createdAt,
//             structuredData: product.structuredData || {},
//             complianceResults: product.complianceResults || {},
//             originalImages: product.originalImages || [],
//             rawOcrText: product.rawOcrText || [],
//             boundingBoxes: product.boundingBoxes || [],
//             backendRoot: backendRoot,
//             officer: {
//                 id: user._id ? user._id.toString() : "OFFICER-01",
//                 username: user.username || "Officer",
//                 fullName: user.fullName || user.username || "Inspection Officer",
//                 email: user.email || "",
//                 department: user.department || "Legal Metrology Inspection Division",
//                 designation: user.designation || "Senior Inspection Officer"
//             }
//         };

//         fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2), "utf-8");

//         const pythonScriptPath = path.resolve(process.cwd(), "../ocr/generate_report_pdf.py");
//         const pythonProcess = spawn("python", [pythonScriptPath, payloadPath, pdfOutputPath], {
//             cwd: path.resolve(process.cwd(), "../ocr")
//         const { ocrDir, pdfScript } = resolveOcrPaths();
//         const pythonExecutable = resolvePythonExecutable();

//         const pythonProcess = spawn(pythonExecutable, [pdfScript, payloadPath, pdfOutputPath], {
//             cwd: ocrDir,
//             env: {
//                 ...process.env,
//                 PYTHONUNBUFFERED: "1"
//             }
//         });

//         let stdoutData = "";
//         let stderrData = "";

//         pythonProcess.stdout.on("data", (data) => {
//             stdoutData += data.toString();
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             stderrData += data.toString();
//         });

//         pythonProcess.on("close", (code) => {
//             // Clean up temporary JSON payload file safely
//             if (fs.existsSync(payloadPath)) {
//                 try { fs.unlinkSync(payloadPath); } catch (e) {}
//             }

//             if (code !== 0 || !fs.existsSync(pdfOutputPath)) {
//                 console.error("PDF Generator Error (stderr):", stderrData, "stdout:", stdoutData);
//                 return reject(new ApiError(500, `PDF report generation failed with exit code ${code}: ${stderrData || stdoutData}`));
//             }

//             resolve(pdfOutputPath);
//         });

//         pythonProcess.on("error", (err) => {
//             if (fs.existsSync(payloadPath)) {
//                 try { fs.unlinkSync(payloadPath); } catch (e) {}
//             }
//             console.error("Failed to spawn PDF Python process:", err);
//             reject(new ApiError(500, `Failed to launch PDF report engine: ${err.message}`));
//         });
//     });
// };



import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import {
    resolvePythonExecutable,
    resolveOcrPaths
} from "./pythonEnv.js";

export const generateProductReportPdf = (product, user) => {
    return new Promise((resolve, reject) => {
        try {
            const reportsDir = path.resolve(
                process.cwd(),
                "public",
                "reports"
            );

            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const reportId = `report_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 8)}`;

            const payloadPath = path.join(
                reportsDir,
                `${reportId}.json`
            );

            const pdfOutputPath = path.join(
                reportsDir,
                `${reportId}.pdf`
            );

            const payload = {
                product,
                user
            };

            fs.writeFileSync(
                payloadPath,
                JSON.stringify(payload, null, 2),
                "utf8"
            );

            const { ocrDir, pdfScript } = resolveOcrPaths();
            const pythonExecutable = resolvePythonExecutable();

            console.log("======================================");
            console.log("Starting PDF report generator...");
            console.log("Using Python:", pythonExecutable);
            console.log("PDF script:", pdfScript);
            console.log("OCR working dir:", ocrDir);
            console.log("======================================");

            const pythonProcess = spawn(
                pythonExecutable,
                [pdfScript, payloadPath, pdfOutputPath],
                {
                    cwd: ocrDir,
                    env: {
                        ...process.env,
                        PYTHONUNBUFFERED: "1"
                    }
                }
            );

            let stdoutData = "";
            let stderrData = "";

            pythonProcess.stdout.on("data", (data) => {
                stdoutData += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                stderrData += data.toString();

                console.error(
                    "PDF Generator Error (stderr):",
                    data.toString()
                );
            });

            pythonProcess.on("error", (error) => {
                try {
                    if (fs.existsSync(payloadPath)) {
                        fs.unlinkSync(payloadPath);
                    }
                } catch {}

                reject(
                    new ApiError(
                        500,
                        `Failed to start PDF generator: ${error.message}`
                    )
                );
            });

            pythonProcess.on("close", (code) => {
                try {
                    if (fs.existsSync(payloadPath)) {
                        fs.unlinkSync(payloadPath);
                    }
                } catch (cleanupError) {
                    console.error(
                        "Failed to clean temporary payload:",
                        cleanupError
                    );
                }

                if (code !== 0) {
                    reject(
                        new ApiError(
                            500,
                            `PDF report generation failed with exit code ${code}: ${
                                stderrData || stdoutData
                            }`
                        )
                    );
                    return;
                }

                if (!fs.existsSync(pdfOutputPath)) {
                    reject(
                        new ApiError(
                            500,
                            "PDF report generation completed but no PDF file was created."
                        )
                    );
                    return;
                }

                resolve(pdfOutputPath);
            });
        } catch (error) {
            reject(
                error instanceof ApiError
                    ? error
                    : new ApiError(
                          500,
                          `PDF report generation failed: ${error.message}`
                      )
            );
        }
    });
};