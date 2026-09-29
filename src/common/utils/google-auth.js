import {AppError} from "../error/error.js";
import {OAuth2Client} from "google-auth-library";

const client =new OAuth2Client()

export async function verifyGoogleToken(idToken) {
    try {

        const ticket=await client.verifyIdToken({
            idToken:idToken,
            audience:process.env.GOOGLE_OAUTH_CLIENT_ID
        })
        return ticket.getPayload();

    }catch (error) {
        throw new AppError('invalid google token',403)
    }
}