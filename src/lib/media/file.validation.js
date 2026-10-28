import * as fs from "node:fs";
import { AppError } from "../error/error.js";
import { fileTypeFromBuffer } from "file-type";

export const allowedFields = {
    image: ["image/png", "image/jpeg"],
    files: ["application/pdf", "application/msword"],
    video: ["video/mp4"],
    audio: ["audio/mpeg"],
};

// delete every uploaded file of the request (used when any file is invalid)
function removeUploadedFiles(files) {
    for (const file of files) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
}

export const fileValidation =
    (allowedTypes = allowedFields.image) =>
        async (req, res, next) => {
            // single() puts the file in req.file, array() puts the files in req.files
            const files = req.file ? [req.file] : (req.files || []);

            try {
                if (files.length === 0) {
                    return next(new AppError("No file uploaded", 400));
                }

                for (const file of files) {
                    // Validate file size (5 MB)
                    if (file.size > 5 * 1024 * 1024) {
                        removeUploadedFiles(files);
                        return next(
                            new AppError("Invalid file size", 400)
                        );
                    }

                    // Read the file
                    const buffer = fs.readFileSync(file.path);

                    // Detect file type using magic numbers
                    const type = await fileTypeFromBuffer(buffer);

                    // Validate file type
                    if (!type || !allowedTypes.includes(type.mime)) {
                        removeUploadedFiles(files);
                        return next(
                            new AppError("Invalid file type", 400)
                        );
                    }
                }

                return next();
            } catch (error) {
                return next(error);
            }
        };
