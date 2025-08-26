import jsonwebtoken, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { JsonWebTokenError } from '../errors/JsonWebTokenError.js';
import { getLogger } from '../utils/logger.js';

const log = getLogger('JWT');
export class Token{

    static generateToken({payload, secret, options}: {payload: object, secret: string, options?: SignOptions}): string{
        try {
            log.debug(`Generating jsonweb token...`)
            log.debug(`With payload: ${JSON.stringify(payload)},`)
            log.debug(`With secret: ${secret}`)
            log.debug(`And options: $${JSON.stringify(options)}`)
            const token = jsonwebtoken.sign(payload, secret, options);
            log.debug('Token succesfully generated');
            return token;
        } catch (error) {
            if(error instanceof Error){
                throw new JsonWebTokenError('Internal server error', 500, `Error generating token: ${error.message}`); 
            }
            throw new JsonWebTokenError('Internal server error', 500, `Error generating token: Unknown error`);
        }
    }

    static verifyToken<T extends JwtPayload>({token, secret}: {token: string, secret: string}): T {
        try {
            const decoded = jsonwebtoken.verify(token, secret) as T;
            log.debug('Token successfully verified');
            return decoded;
        } catch (error) {
            throw new JsonWebTokenError('Invalid or expired token', 401, `Error verifying token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}