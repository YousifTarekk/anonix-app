import {toMs} from "../../../common/utils/time.js";
import jwt from "jsonwebtoken";

export function generateToken(playLoad) {
   return  jwt.sign(

            playLoad,

        process.env.JWT_SECRET,
        {
            expiresIn: toMs(1, "hours")
        }
    );
}