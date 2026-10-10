import multer, {diskStorage} from "multer";
import {AppError} from "../error/error.js";
import {allowedFields} from "./file.validation.js";

function fileUpload(allowedTypes=allowedFields.image) {
    return multer({
        fileFilter:function (req, file, cb) {
          if (!allowedTypes.includes(file.mimetype)) {
              return cb(new AppError('invalid file type',400));
          }
          cb(null, true);
        },
        storage:diskStorage({
            destination:"uploads",
            filename:function (req, file, cb){
                cb(null,`${crypto.randomUUID()}-${file.originalname}`)
            }
        })
    })
}
export function uploadSingleFile(fieldName,allowedTypes=allowedFields.image) {
    return fileUpload(allowedTypes).single(fieldName)
}
export function uploadFilesArray(fieldNames,maxCount){
    return fileUpload().array(fieldNames,maxCount)
}
export function uploadFields(fields){
    return fileUpload().fields(fields)
}