import { createClient } from '@supabase/supabase-js';

// Note: These will be provided by Vercel environment variables in production
// For local testing, ensure they are in your .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Gets a lead by PSID.
 * @param {string} psid 
 */
export async function getLead(psid) {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('psid', psid)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase Error (getLead):', error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Service Error (getLead):', error);
        return null;
    }
}

/**
 * Saves or updates a lead using upsert.
 */
export async function saveLead({ psid, name, phone, state }) {
    try {
        const { error } = await supabase
            .from('leads')
            .upsert({ psid, name, phone, state }, { onConflict: 'psid' });

        if (error) {
            console.error('❌ Supabase Error (saveLead):', error);
        }
    } catch (error) {
        console.error('❌ Service Error (saveLead):', error);
    }
}

/**
 * Optional: Helper specifically for initializing DB via route if needed.
 * Note: Table creation is usually done via Supabase SQL Editor.
 */
export async function initDB() {
    console.log('Please initialize your table via the Supabase SQL Editor using the provided schema.');
}

export default {
    getLead,
    saveLead,
    initDB
};
