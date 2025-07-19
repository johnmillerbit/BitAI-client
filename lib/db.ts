import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const testConnection = async () => {
    try {
        await pool.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

testConnection();

export default pool;
