import { RequestModel } from "../models/requestModel.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger("REQUEST_SERVICE");


export class RequestService{
    static async getRequests(){
        logger.info("Starting to fetch requests...");
        const requests = await RequestModel.getRequests();
        logger.info("Requests fetched successfully.");
        return {
            success: true,
            message: "Requests fetched successfully.",
            data: requests
        };
    }

    static async createRequest({id_usuario, id_animal, tipo_acogida}: {id_usuario: number, id_animal: number, tipo_acogida: string}) {
        let id_tipo_acogida = tipo_acogida === "adopt" ? 2 : 1;
        logger.info("Starting request creation...");
        const result = await RequestModel.insertAnimalRequest({
            id_usuario,
            id_animal,
            id_tipo_acogida
        })
        logger.info("Request created successfully.");
        return {
            success: true,
            message: "Request created successfully.",
            data: result
        };
    }

    static async rejectRequest({ id_acogida }: { id_acogida: number }) {
        logger.info('Starting request rejection...')
        const result = await RequestModel.rejectAnimalRequest({
            id_acogida
        });
        logger.info('Request rejected successfully.')
        return {
            success: true,
            message: "Request rejected successfully.",
            data: result
        };
    }

    static async acceptRequest({ id_acogida }: { id_acogida: number }) {
        logger.info('Starting request acceptance...')
        const result = await RequestModel.acceptAnimalRequest({
            id_acogida
        });
        logger.info('Request accepted successfully.')
        return {
            success: true,
            message: "Request accepted successfully.",
            data: result
        };
    }

    static async deleteRequest({id_acogida}: {id_acogida: number}) {
        logger.info('Starting request deletion...')
        const result = await RequestModel.deleteRequest({
            id_acogida
        });
        logger.info('Request deleted successfully.')
        return {
            success: true,
            message: "Request deleted successfully.",
            data: result
        };
    }
}