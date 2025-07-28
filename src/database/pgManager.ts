import { Pool, QueryResult, QueryResultRow, PoolClient, PoolConfig } from 'pg';
import { pgOptions } from '../interfaces/pg-manager.interface.js';


export class pgManager {
    public querys: Record<string, string>;
    public config: PoolConfig;
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
            throw new Error(`Failed to get database connection: ${error}`); 
        }
    }

    async executeQuery<T extends QueryResultRow = any>({queryKey = '', params = [], client}: {queryKey: string, params: any[], client?: PoolClient}): Promise<QueryResult<T>> {
        const query = this.querys[queryKey];
        if (!query) {
            throw new Error(`Query not found: ${queryKey}`);
        }
    
        const shouldRelease = !client;
    
        if (!client) {
            client = await this.getConnection();
        }
    
        try {
            console.log(`[PG] Executing query: ${queryKey} with params: ${JSON.stringify(params)}`);
            const result = await client.query<T>(query, params);
            console.log(`[PG] Query executed successfully: ${queryKey}`);
            return result; // Only the rows are returned
        } catch (error) {
            throw new Error(`Query execution failed: ${String(error)}`);
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
            throw new Error(`Failed to close database pool: ${error}`);
        }
    }

    async releaseConnection(client: PoolClient): Promise<void> {
        try {
            client.release();
        } catch (error) {
            throw new Error(`Failed to release database connection: ${error}`);
        }
    }
    async beginTransaction(): Promise<PoolClient> {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN');
            return client;
        } catch (error) {
            client.release();
            throw new Error(`Failed to begin transaction: ${error}`);
        }
    }

    async commitTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('COMMIT');
        } catch (error) {
            throw new Error(`Failed to commit transaction: ${error}`);
        } finally {
            client.release();
        }
    }

    async rollbackTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('ROLLBACK');
        } catch (error) {
            throw new Error(`Failed to rollback transaction: ${error}`);
        } finally {
            client.release();
        }
    }
}