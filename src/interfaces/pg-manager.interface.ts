import { PoolConfig } from "pg";

export interface pgOptions {
    querys: Record<string, string>;
    config: PoolConfig;
}