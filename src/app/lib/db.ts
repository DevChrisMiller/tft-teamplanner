// lib/db.ts
import { Unit } from "@/d";
import * as mssql from "mssql";

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
console.log(process.env.DB_SERVER);
const sqlConfig: mssql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

// Global connection pool
let pool: mssql.ConnectionPool | null = null;

export async function getConnection(): Promise<mssql.ConnectionPool> {
  try {
    if (pool) {
      return pool;
    }

    pool = await new mssql.ConnectionPool(sqlConfig).connect();

    // Handle pool errors
    pool.on("error", (err: any) => {
      console.error("SQL Pool Error:", err);
      pool = null;
    });

    return pool;
  } catch (err) {
    console.error("SQL Connection Error:", err);
    throw err;
  }
}

// Utility function for executing stored procedures
export async function execStoredProcedure<T>(
  procName: string,
  params?: { [key: string]: any }
): Promise<T[]> {
  const pool = await getConnection();
  const request = pool.request();

  // Add parameters if they exist
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  try {
    const result = await request.execute(procName);
    return result.recordset;
  } catch (err) {
    console.error(`Error executing ${procName}:`, err);
    throw err;
  }
}

// Example usage with a specific type
export async function getUnits() {
  return execStoredProcedure<Unit>("GetUnits");
}

// Clean up function for app termination
export async function closePool() {
  try {
    await pool?.close();
    pool = null;
  } catch (err) {
    console.error("Error closing pool:", err);
    throw err;
  }
}
