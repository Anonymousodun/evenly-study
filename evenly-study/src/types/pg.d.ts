declare module 'pg' {
  export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number | null;
  }
  export class Pool {
    constructor(config?: any);
    query(text: string, params?: any[]): Promise<QueryResult>;
    end(): Promise<void>;
  }
  export class Client {
    constructor(config?: any);
    connect(): Promise<void>;
    query(text: string, params?: any[]): Promise<QueryResult>;
    end(): Promise<void>;
  }
}
