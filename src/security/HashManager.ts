import argon2 from 'argon2';
import { BaseError } from '../errors/BaseError.js';
import { getLogger } from '../utils/logger.js';

const log = getLogger('HASH');


export class HashManager {
    static async hashData({data}: {data: string}): Promise<string> {
        try {
            log.debug("Hashing data...");
            log.debug("Data to hash:", data);
            const hashedData = await argon2.hash(data, {
                                        memoryCost: 65536, // 64 MB
                                        timeCost: 4, // 4 iterations
                                        parallelism: 1, // 1 thread
                                        hashLength: 32, // 32 bytes
                                        type: argon2.argon2id, // Use Argon2id for better security
                                    });
            return hashedData;
        } catch (error) {
            throw new BaseError(`Error hashing data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async verifyData({ hashedData, data }: {hashedData: string, data: string}): Promise<boolean> {
        try {
            log.debug("Verifying password...");
            log.debug("Hashed Data:", hashedData);
            log.debug("Data to verify:", data);
            const isValid = await argon2.verify(hashedData, data);
            return isValid;
        } catch (error) {
            throw new BaseError(`Error verifying password: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}