// import { spawn } from "child_process";
// import path from "path";
// import { ApiError } from "../utils/ApiError.js";

// export const runOcrPipeline = (imagePaths) => {
//     return new Promise((resolve, reject) => {
//         if (!imagePaths || imagePaths.length === 0) {
//             return reject(new ApiError(400, "No image paths provided for OCR execution"));
//         }

//         const pythonScriptPath = path.resolve(process.cwd(), "../ocr/main.py");
//         const absoluteImagePaths = imagePaths.map(p => path.resolve(process.cwd(), p));

//         const pythonProcess = spawn("python", [pythonScriptPath, ...absoluteImagePaths], {
//             cwd: path.resolve(process.cwd(), "../ocr")
//         });

//         let stdoutData = "";
//         let stderrData = ""

//         pythonProcess.stdout.on("data", (data) => {
//             stdoutData += data.toString();
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             stderrData += data.toString();
//         });

//         pythonProcess.on("close", (code) => {
//             if (code !== 0 && !stdoutData.includes("---JSON_START---")) {
//                 console.error("Python OCR Process Error (stderr):", stderrData);
//                 return reject(new ApiError(500, `OCR execution failed with exit code ${code}`));
//             }

//             try {
//                 const jsonStart = stdoutData.indexOf("---JSON_START---");
//                 const jsonEnd = stdoutData.indexOf("---JSON_END---");

//                 if (jsonStart === -1 || jsonEnd === -1) {
//                     console.error("Raw stdout output:", stdoutData);
//                     return reject(new ApiError(500, "Invalid JSON output delimiters from OCR engine"));
//                 }

//                 const jsonString = stdoutData.substring(jsonStart + "---JSON_START---".length, jsonEnd).trim();
//                 const parsedResult = JSON.parse(jsonString);

//                 if (!parsedResult.success) {
//                     return reject(new ApiError(500, parsedResult.error || "OCR extraction failed in Python engine"));
//                 }

//                 resolve(parsedResult);
//             } catch (err) {
//                 console.error("Failed to parse Python OCR output:", err, "Raw stdout:", stdoutData);
//                 reject(new ApiError(500, "Failed to parse OCR response JSON"));
//             }
//         });

//         pythonProcess.on("error", (err) => {
//             console.error("Failed to spawn Python process:", err);
//             reject(new ApiError(500, `Failed to launch Python OCR engine: ${err.message}`));
//         });
//     });
// };









// import { spawn } from "child_process";
// import path from "path";
// import crypto from "crypto";
// import { ApiError } from "../utils/ApiError.js";

// let pythonProcess = null;
// let stdoutBuffer = "";

// const pendingRequests = new Map();


// // Start Python OCR server
// function startPythonOcrServer() {

//     if (pythonProcess) {
//         return;
//     }

//     const pythonScriptPath = path.resolve(
//         process.cwd(),
//         "../ocr/ocr_server.py"
//     );

//     const ocrWorkingDirectory = path.resolve(
//         process.cwd(),
//         "../ocr"
//     );

//     console.log("Starting persistent Python OCR server...");

//     pythonProcess = spawn(
//         "python",
//         [pythonScriptPath],
//         {
//             cwd: ocrWorkingDirectory
//         }
//     );


//     // Python stdout
//     pythonProcess.stdout.on("data", (data) => {

//         stdoutBuffer += data.toString();

//         const lines = stdoutBuffer.split("\n");

//         stdoutBuffer = lines.pop() || "";

//         for (const line of lines) {

//             const trimmedLine = line.trim();

//             if (!trimmedLine) {
//                 continue;
//             }

//             if (!trimmedLine.startsWith("__OCR_RESPONSE__")) {
//                 continue;
//             }

//             try {

//                 const jsonString = trimmedLine.replace(
//                     "__OCR_RESPONSE__",
//                     ""
//                 );

//                 const result = JSON.parse(jsonString);

//                 const requestId = result.requestId;

//                 // If using queue matching below
//                 if (pendingRequests.size > 0) {

//                     const [firstRequestId, request] =
//                         pendingRequests.entries().next().value;

//                     pendingRequests.delete(firstRequestId);

//                     if (!result.success) {
//                         request.reject(
//                             new ApiError(
//                                 500,
//                                 result.error || "OCR processing failed"
//                             )
//                         );
//                     } else {
//                         request.resolve(result);
//                     }
//                 }

//             } catch (error) {

//                 console.error(
//                     "Failed to parse OCR response:",
//                     error
//                 );

//             }
//         }
//     });


//     // Python stderr
//     pythonProcess.stderr.on("data", (data) => {

//         const message = data.toString().trim();

//         if (message) {
//             console.log("[OCR]", message);
//         }

//     });


//     // Python process exits
//     pythonProcess.on("close", (code) => {

//         console.error(
//             `Python OCR server stopped with code ${code}`
//         );

//         pythonProcess = null;
//         stdoutBuffer = "";

//         // Reject all pending requests
//         for (const request of pendingRequests.values()) {

//             request.reject(
//                 new ApiError(
//                     500,
//                     "OCR engine stopped unexpectedly"
//                 )
//             );

//         }

//         pendingRequests.clear();

//     });


//     // Failed to start Python
//     pythonProcess.on("error", (error) => {

//         console.error(
//             "Failed to start Python OCR server:",
//             error
//         );

//         pythonProcess = null;

//     });
// }


// // Main OCR function
// export const runOcrPipeline = (imagePaths) => {

//     return new Promise((resolve, reject) => {

//         if (!imagePaths || imagePaths.length === 0) {

//             return reject(
//                 new ApiError(
//                     400,
//                     "No image paths provided for OCR execution"
//                 )
//             );

//         }


//         // Start Python only once
//         startPythonOcrServer();


//         const absoluteImagePaths = imagePaths.map(
//             p => path.resolve(process.cwd(), p)
//         );


//         const requestId = crypto.randomUUID();


//         pendingRequests.set(
//             requestId,
//             {
//                 resolve,
//                 reject
//             }
//         );


//         const request = JSON.stringify({
//             requestId,
//             imagePaths: absoluteImagePaths
//         });


//         pythonProcess.stdin.write(request + "\n");

//     });

// };





import { spawn } from "child_process";
import path from "path";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";


let pythonProcess = null;

let stdoutBuffer = "";

let pythonReady = false;

const pendingRequests = new Map();


/*
|--------------------------------------------------------------------------
| Start persistent Python OCR server
|--------------------------------------------------------------------------
*/

function startPythonOcrServer() {

    // Already running
    if (pythonProcess) {
        return;
    }


    const pythonScriptPath = path.resolve(
        process.cwd(),
        "../ocr/ocr_server.py"
    );


    const pythonExecutable = path.resolve(
        process.cwd(),
        "../.venv/Scripts/python.exe"
    );


    const ocrWorkingDirectory = path.resolve(
        process.cwd(),
        "../ocr"
    );


    console.log("======================================");
    console.log("Starting persistent Python OCR server...");
    console.log("Using Python:", pythonExecutable);
    console.log("OCR script:", pythonScriptPath);
    console.log("======================================");


    pythonProcess = spawn(
        pythonExecutable,
        [pythonScriptPath],
        {
            cwd: ocrWorkingDirectory
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Python STDOUT
    |--------------------------------------------------------------------------
    */

    pythonProcess.stdout.on("data", (data) => {

        stdoutBuffer += data.toString();


        const lines = stdoutBuffer.split("\n");


        // Keep incomplete line for next chunk
        stdoutBuffer = lines.pop() || "";


        for (const line of lines) {

            const trimmedLine = line.trim();


            if (!trimmedLine) {
                continue;
            }


            /*
            |--------------------------------------------------------------------------
            | OCR server ready
            |--------------------------------------------------------------------------
            */

            if (trimmedLine === "OCR_READY") {

                pythonReady = true;

                console.log(
                    "[OCR NODE] Python OCR server is READY"
                );

                continue;
            }


            /*
            |--------------------------------------------------------------------------
            | OCR response
            |--------------------------------------------------------------------------
            */

            if (!trimmedLine.startsWith("__OCR_RESPONSE__")) {
                continue;
            }


            try {

                const jsonString =
                    trimmedLine.replace(
                        "__OCR_RESPONSE__",
                        ""
                    );


                const result = JSON.parse(jsonString);


                const requestId = result.requestId;


                console.log(
                    `[OCR NODE] Python response received: ${requestId}`
                );


                const request =
                    pendingRequests.get(requestId);


                if (!request) {

                    console.error(
                        "[OCR NODE] No pending request found for:",
                        requestId
                    );

                    continue;
                }


                pendingRequests.delete(requestId);


                const elapsed =
                    (
                        (Date.now() - request.startTime)
                        / 1000
                    ).toFixed(2);


                console.log(
                    `[OCR NODE] Request completed in ${elapsed} seconds`
                );


                if (!result.success) {

                    request.reject(
                        new ApiError(
                            500,
                            result.error ||
                            "OCR processing failed"
                        )
                    );

                } else {

                    request.resolve(result);

                }

            } catch (error) {

                console.error(
                    "[OCR NODE] Failed to parse OCR response:",
                    error
                );

            }
        }
    });


    /*
    |--------------------------------------------------------------------------
    | Python STDERR
    |--------------------------------------------------------------------------
    */

    pythonProcess.stderr.on("data", (data) => {

        const message = data.toString().trim();


        if (message) {

            console.log(
                "[OCR]",
                message
            );

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Python process closed
    |--------------------------------------------------------------------------
    */

    pythonProcess.on("close", (code) => {

        console.error(
            `Python OCR server stopped with code ${code}`
        );


        pythonProcess = null;

        pythonReady = false;

        stdoutBuffer = "";


        /*
        |--------------------------------------------------------------------------
        | Reject all pending requests
        |--------------------------------------------------------------------------
        */

        for (
            const request
            of pendingRequests.values()
        ) {

            request.reject(
                new ApiError(
                    500,
                    "OCR engine stopped unexpectedly"
                )
            );

        }


        pendingRequests.clear();

    });


    /*
    |--------------------------------------------------------------------------
    | Python process error
    |--------------------------------------------------------------------------
    */

    pythonProcess.on("error", (error) => {

        console.error(
            "Failed to start Python OCR server:",
            error
        );


        pythonProcess = null;

        pythonReady = false;


        for (
            const request
            of pendingRequests.values()
        ) {

            request.reject(
                new ApiError(
                    500,
                    `Failed to launch OCR engine: ${error.message}`
                )
            );

        }


        pendingRequests.clear();

    });

}


/*
|--------------------------------------------------------------------------
| Run OCR pipeline
|--------------------------------------------------------------------------
*/

export const runOcrPipeline = (imagePaths) => {

    return new Promise((resolve, reject) => {


        /*
        |--------------------------------------------------------------------------
        | Validate image paths
        |--------------------------------------------------------------------------
        */

        if (
            !imagePaths ||
            imagePaths.length === 0
        ) {

            return reject(
                new ApiError(
                    400,
                    "No image paths provided for OCR execution"
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Make sure Python server is running
        |--------------------------------------------------------------------------
        */

        startPythonOcrServer();


        /*
        |--------------------------------------------------------------------------
        | Convert image paths to absolute paths
        |--------------------------------------------------------------------------
        */

        const absoluteImagePaths =
            imagePaths.map(
                p => path.resolve(
                    process.cwd(),
                    p
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Create unique request ID
        |--------------------------------------------------------------------------
        */

        const requestId =
            crypto.randomUUID();


        /*
        |--------------------------------------------------------------------------
        | Record request start time
        |--------------------------------------------------------------------------
        */

        const requestStart =
            Date.now();


        /*
        |--------------------------------------------------------------------------
        | Store request
        |--------------------------------------------------------------------------
        */

        pendingRequests.set(
            requestId,
            {
                resolve,
                reject,
                startTime: requestStart
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Create request payload
        |--------------------------------------------------------------------------
        */

        const request =
            JSON.stringify({
                requestId,
                imagePaths: absoluteImagePaths
            });


        /*
        |--------------------------------------------------------------------------
        | Python process check
        |--------------------------------------------------------------------------
        */

        if (!pythonProcess) {

            pendingRequests.delete(
                requestId
            );


            return reject(
                new ApiError(
                    500,
                    "OCR Python process could not be started"
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        | If Python is still loading the model, do NOT send the request yet.
        |
        | Normally this won't happen because the server starts during
        | backend initialization, but this protects against race conditions.
        |--------------------------------------------------------------------------
        */

        if (!pythonReady) {

            console.log(
                `[OCR NODE] Python not ready yet. Request ${requestId} is waiting.`
            );


            /*
            |--------------------------------------------------------------------------
            | Wait until OCR_READY
            |--------------------------------------------------------------------------
            |
            | We don't need another queue here.
            | The request stays inside pendingRequests.
            |
            | When OCR_READY arrives, we send all waiting requests.
            |--------------------------------------------------------------------------
            */

            const waitForReady = setInterval(() => {

                if (!pythonProcess) {

                    clearInterval(waitForReady);

                    if (pendingRequests.has(requestId)) {

                        pendingRequests.delete(
                            requestId
                        );

                        reject(
                            new ApiError(
                                500,
                                "OCR Python process stopped before becoming ready"
                            )
                        );

                    }

                    return;
                }


                if (pythonReady) {

                    clearInterval(waitForReady);


                    console.log(
                        `[OCR NODE] Sending queued request: ${requestId}`
                    );


                    pythonProcess.stdin.write(
                        request + "\n"
                    );

                }

            }, 50);


            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Python is already ready
        |--------------------------------------------------------------------------
        */

        console.log(
            `[OCR NODE] Sending request to Python: ${requestId}`
        );


        pythonProcess.stdin.write(
            request + "\n"
        );


        console.log(
            `[OCR NODE] Request sent to Python`
        );

    });

};


/*
|--------------------------------------------------------------------------
| START OCR SERVER WHEN NODE IMPORTS THIS SERVICE
|--------------------------------------------------------------------------
|
| This is the important optimization.
|
| Previously:
|
|   User inspection
|        ↓
|   Start Python
|        ↓
|   Load PaddleOCR
|        ↓
|   OCR
|
| Now:
|
|   Node starts
|        ↓
|   Start Python
|        ↓
|   Load PaddleOCR
|        ↓
|   OCR_READY
|        ↓
|   Wait
|        ↓
|   User inspection
|        ↓
|   OCR immediately
|
|--------------------------------------------------------------------------
*/

startPythonOcrServer();