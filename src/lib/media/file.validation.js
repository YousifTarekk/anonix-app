
import * as fs from "node:fs";
import { AppError } from "../error/error.js";
import { fileTypeFromBuffer } from "file-type";

export const allowedFields = {
    image: ["image/png", "image/jpeg"],
    files: ["application/pdf", "application/msword"],
    video: ["video/mp4"],
    audio: ["audio/mpeg"],
};

export const fileValidation =
    (allowedTypes = allowedFields.image) =>
        async (req, res, next) => {
            let filePath;

            try {
                if (!req.file) {
                    return next(new AppError("No file uploaded", 400));
                }

                filePath = req.file.path;

                // Validate file size (5 MB)
                if (req.file.size > 5 * 1024 * 1024) {
                    fs.unlinkSync(filePath);
                    return next(
                        new AppError("Invalid file size", 400)
                    );
                }

                // Read the file
                const buffer = fs.readFileSync(filePath);

                // Detect file type using magic numbers
                const type = await fileTypeFromBuffer(buffer);

                // Validate file type
                if (!type || !allowedTypes.includes(type.mime)) {
                    fs.unlinkSync(filePath);
                    return next(
                        new AppError("Invalid file type", 400)
                    );
                }

                return next();
            } catch (error) {
                return next(error);
            }
        };
