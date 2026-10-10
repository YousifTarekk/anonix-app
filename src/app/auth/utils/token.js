import {toMs} from "../../../pkg/utils/time.js";
import jwt from "jsonwebtoken";
import {env} from "../../../lib/config/env.js";

export function generateToken(playLoad) {
   return  jwt.sign(

            playLoad,

       env.jwt.secret,
        {
            expiresIn: toMs(1, "hours")
        }
    );
}