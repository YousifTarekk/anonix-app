// import bcrypt from "bcrypt";
import argon2 from "argon2";

export async function hashPassword(password) {
    return argon2.hash(password,{saltLength:10})

}
export async function comparePassword(password, hashedPassword) {
    return  argon2.verify(hashedPassword, password);
}