import argon2 from 'argon2';
import { BaseError } from '../errors/BaseError.js';


export class HashManager {
    static async hashData({data}: {data: string}): Promise<string> {
        try {
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
            console.log("[HashManager] Verifying password...");
            console.log("Hashed Data:", hashedData);
            console.log("Data to verify:", data);
            const isValid = await argon2.verify(hashedData, data);
            return isValid;
        } catch (error) {
            throw new BaseError(`Error verifying password: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}