import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// backend/src/services -> repo root is 3 levels up
const repoRoot = path.resolve(__dirname, "../../..");

/**
 * Resolves the appropriate Python executable across environments.
 * Priorities:
 * 1. process.env.PYTHON_PATH or process.env.PYTHON_EXECUTABLE
 * 2. Virtual environments (.venv) in repoRoot or backend or ocr
 * 3. System python ('python' on Windows, 'python3' on Linux/Render)
 */
export function resolvePythonExecutable() {
    if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
    if (process.env.PYTHON_EXECUTABLE) return process.env.PYTHON_EXECUTABLE;

    const isWindows = process.platform === "win32";

    const venvCandidates = [
        path.join(repoRoot, isWindows ? ".venv/Scripts/python.exe" : ".venv/bin/python"),
        path.join(repoRoot, "ocr", isWindows ? ".venv/Scripts/python.exe" : ".venv/bin/python"),
        path.join(process.cwd(), isWindows ? ".venv/Scripts/python.exe" : ".venv/bin/python"),
        path.join(process.cwd(), "..", isWindows ? ".venv/Scripts/python.exe" : ".venv/bin/python")
    ];

    for (const venvPath of venvCandidates) {
        if (fs.existsSync(venvPath)) {
            return venvPath;
        }
    }

    return isWindows ? "python" : "python3";
}

/**
 * Resolves absolute paths for OCR scripts and working directory.
 */
export function resolveOcrPaths() {
    const ocrDirCandidates = [
        process.env.OCR_DIR,
        path.resolve(repoRoot, "ocr"),
        path.resolve(process.cwd(), "../ocr"),
        path.resolve(process.cwd(), "ocr")
    ].filter(Boolean);

    let resolvedDir = null;
    for (const candidate of ocrDirCandidates) {
        if (fs.existsSync(candidate)) {
            resolvedDir = candidate;
            break;
        }
    }

    if (!resolvedDir) {
        resolvedDir = path.resolve(process.cwd(), "../ocr");
    }

    return {
        ocrDir: resolvedDir,
        ocrServerScript: path.join(resolvedDir, "ocr_server.py"),
        mainScript: path.join(resolvedDir, "main.py"),
        pdfScript: path.join(resolvedDir, "generate_report_pdf.py")
    };
}

