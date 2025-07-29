import argon2 from 'argon2';



export class HashManager {
    static async hashPassword({password}: {password: string}): Promise<string> {
        try {
            const hashedPassword = await argon2.hash(password, {
                                        memoryCost: 65536, // 64 MB
                                        timeCost: 4, // 4 iterations
                                        parallelism: 1, // 1 thread
                                        hashLength: 32, // 32 bytes
                                        type: argon2.argon2id, // Use Argon2id for better security
                                    });
            return hashedPassword;
        } catch (error) {
            throw new Error(`Error hashing password: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async verifyPassword({hashedPassword, password }: {hashedPassword: string, password: string}): Promise<boolean> {
        try {
            const isValid = await argon2.verify(hashedPassword, password);
            return isValid;
        } catch (error) {
            throw new Error(`Error verifying password: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}