import jsonwebtoken, { SignOptions, JsonWebTokenError} from 'jsonwebtoken';
import { InternalError } from '../errors/InternalError.js';


export class Token{

    static generateToken({payload, secret, options}: {payload: object, secret: string, options?: SignOptions}): string{
        try {
            console.log(`[JWT] Generating jsonweb token...`)
            console.log(`[JWT] With payload: ${payload},`)
            console.log(`[JWT] With secret: ${secret}`)
            console.log(`[JWT] And options: ${options}`)
            const token = jsonwebtoken.sign(payload, secret, options);
            console.log('[JWT] Token succesfully generated');
            return token;
        } catch (error) {
            if(error instanceof Error){
                throw new InternalError('Internal server error', 500, error.message || 'Unknown error') 
            }
            throw new InternalError('Internal server error', 500, 'Unknown error');
        }
    }

    static verifyToken({token, secret}: {token: string, secret: string}): string | object {
        try {
            const decoded = jsonwebtoken.verify(token, secret);
            console.log('[JWT] Token successfully verified');
            return decoded;
        } catch (error) {
            if (error instanceof Error) {
                throw new JsonWebTokenError('Invalid token');
            }
            throw new JsonWebTokenError('Invalid token');
        }
    }
}