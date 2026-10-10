import {AppError} from "../error/error.js";
import {OAuth2Client} from "google-auth-library";

const client =new OAuth2Client()

export async function verifyGoogleToken(idToken) {
    try {

        const ticket=await client.verifyIdToken({
            idToken:idToken,
            audience:env.google.webClientID
        })
        return ticket.getPayload();

    }catch (error) {
        throw new AppError('invalid google token',403)
    }
}