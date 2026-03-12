import { sql } from '@vercel/postgres';

/**
 * Gets a lead by PSID.
 * @param {string} psid 
 */
export async function getLead(psid) {
    try {
        const { rows } = await sql`SELECT * FROM leads WHERE psid = ${psid}`;
        return rows[0] || null;
    } catch (error) {
        console.error('Database Error (getLead):', error);
        return null;
    }
}

/**
 * Saves or updates a lead with state management.
 * @param {object} lead 
 */
export async function saveLead({ psid, name = null, phone = null, state }) {
    try {
        await sql`
            INSERT INTO leads (psid, name, phone, state)
            VALUES (${psid}, ${name}, ${phone}, ${state})
            ON CONFLICT (psid) 
            DO UPDATE SET 
                name = EXCLUDED.name, 
                phone = EXCLUDED.phone, 
                state = EXCLUDED.state,
                updated_at = CURRENT_TIMESTAMP
        `;
    } catch (error) {
        console.error('Database Error (saveLead):', error);
    }
}

/**
 * Initializes the database table if it doesn't exist.
 */
export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS leads (
                psid TEXT PRIMARY KEY,
                name TEXT,
                phone TEXT,
                state TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database Initialization Error:', error);
    }
}

export default {
    getLead,
    saveLead,
    initDB
};
