import jsonwebtoken, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { JsonWebTokenError } from '../errors/JsonWebTokenError.js';

export class Token{

    static generateToken({payload, secret, options}: {payload: object, secret: string, options?: SignOptions}): string{
        try {
            console.log(`[JWT] Generating jsonweb token...`)
            console.log(`[JWT] With payload: ${JSON.stringify(payload)},`)
            console.log(`[JWT] With secret: ${secret}`)
            console.log(`[JWT] And options: $${JSON.stringify(options)}`)
            const token = jsonwebtoken.sign(payload, secret, options);
            console.log('[JWT] Token succesfully generated');
            return token;
        } catch (error) {
            if(error instanceof Error){
                throw new JsonWebTokenError('Internal server error', 500, `Error generating token: ${error.message}`); 
            }
            throw new JsonWebTokenError('Internal server error', 500, `Error generating token: Unknown error`);
        }
    }

    static verifyToken({token, secret}: {token: string, secret: string}): JwtPayload {
        try {
            const decoded = jsonwebtoken.verify(token, secret) as JwtPayload;
            console.log('[JWT] Token successfully verified');
            return decoded;
        } catch (error) {
            console.error('[JWT] Error verifying token:', error);
            throw new JsonWebTokenError('Invalid or expired token', 401, `Error verifying token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}