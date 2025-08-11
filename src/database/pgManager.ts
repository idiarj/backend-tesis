import { Pool, QueryResult, QueryResultRow, PoolClient, PoolConfig } from 'pg';
import { pgOptions } from '../interfaces/pg-manager.interface.js';
import { DatabaseError } from '../errors/DatabaseError.js';
import { ConnectionError } from '../errors/ConnectionError.js';
import { getLogger } from '../utils/logger.js';


const logger = getLogger('PG');


export class pgManager {
    private querys: Record<string, string>;
    private config: PoolConfig;
    private pool: Pool;

    constructor({querys, config} : pgOptions) {
        this.config = config;
        this.querys = querys;
        this.pool = new Pool(this.config);
    }

    async getConnection() : Promise<PoolClient> {
        try {
            return await this.pool.connect();
        } catch (error) {
            throw new ConnectionError(`Internal server error`, 500, `Failed to get database connection: ${String(error )}`);
        }
    }

    async executeRawQuery({query, params = [], client}: {query: string, params?: any[], client?: PoolClient}): Promise<QueryResult> {
        if (!client) {
            client = await this.getConnection();
        }
        const shouldRealease = !client;
        try {
            return await client.query(query, params);
        } catch (error) {
            throw new DatabaseError(`Internal server error`, 500, `Failed to execute query: ${query}, ${String(error)}`);
        } finally {
            if (shouldRealease) {
                await this.releaseConnection(client);
            }
        }
    }

    async executeQuery<T extends QueryResultRow = any>({queryKey = '', params = [], client}: {queryKey: string, params: any[], client?: PoolClient}): Promise<QueryResult<T>> {
        const query = this.querys[queryKey];
        if (!query) {
            throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${query} not found.`);
        }
    
        const shouldRelease = !client;
    
        if (!client) {
            client = await this.getConnection();
        }
    
        try {
            logger.info(`Executing query: ${queryKey} with params: ${JSON.stringify(params)}`);
            const result = await client.query<T>(query, params);
            logger.info(`Query executed successfully: ${queryKey}`);
            return result; // Only the rows are returned
        } catch (error) {
            throw new DatabaseError('Internal server error', 500, `Execution for query ${queryKey} failed: ${String(error)}`);
        } finally {
            if (shouldRelease && client) {
                await this.releaseConnection(client); 
            }
        }
    }

    async closePool(): Promise<void> {
        try {
            await this.pool.end();
        } catch (error) {
            throw new DatabaseError('Internal server error', 500, `Failed to close database pool: ${error}`);
        }
    }

    async releaseConnection(client: PoolClient): Promise<void> {
        try {
            client.release();
        } catch (error) {
            throw new DatabaseError(`Internal server error`, 500, `Failed to release database connection: ${String(error)}`);
        }
    }
    async beginTransaction(): Promise<PoolClient> {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN');
            return client;
        } catch (error) {
            client.release();
            throw new DatabaseError(`Internal server error`, 500, `Failed to begin transaction: ${String(error)}`);
        }
    }

    async commitTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('COMMIT');
        } catch (error) {
            throw new DatabaseError(`Internal server error`, 500, `Failed to commit transaction: ${String(error)}`);
        } finally {
            client.release();
        }
    }

    async rollbackTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('ROLLBACK');
        } catch (error) {
            throw new DatabaseError(`Internal server error`, 500, `Failed to rollback transaction: ${String(error)}`);
        } finally {
            client.release();
        }
    }
}