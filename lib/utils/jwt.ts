import * as jose from 'jose';
import { SignOptions } from 'jsonwebtoken';

const secret = process.env.AUTH_SECRET || '06b9ce5826da4a206c10b2621279a40da43411476f2cb1cb2a3a7952d630fab2';

const secretKey = Buffer.from(secret, "hex");

export function verifyJWT(token: string) {
    return jose.jwtVerify(token, secretKey, { algorithms: ["HS256"] });
}


export function signJWT(payload: any, options: Partial<SignOptions>) {
    return new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(options.expiresIn ?? "1m")
        .sign(secretKey);
}


export function encryptJWT(payload: any, { expiresIn }: SignOptions = {}) {
    return new jose.EncryptJWT(payload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(expiresIn ? `${expiresIn}s` : "1m")
        // .setSubject(payload.sub ?? undefined)
        .encrypt(secretKey);
}

export function decryptJWT(jwt: string) {
    return jose.jwtDecrypt(jwt, secretKey, { contentEncryptionAlgorithms: ["A256GCM"], keyManagementAlgorithms: ["dir"], });
}