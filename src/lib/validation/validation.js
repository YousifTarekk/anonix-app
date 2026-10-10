import {z} from 'zod';
import {AppError} from "../error/error.js";
export function validationBody(dto,body){
    const result=z.safeParse(dto,body)
    if(result.success===false){
        const errMessage=result.error.issues.map(issue=>`${issue.path[0]??'error'} :${issue.message}`)
        throw new AppError(errMessage.join(', '),400)
    }
    return result.data;
}