import { UserModel } from "../models/userModel.js";




export class PermissionService {
    constructor(private userModel: UserModel) {}

    async hasPermission(userId: string, permission: string): Promise<boolean> {
        return true;
    }
}