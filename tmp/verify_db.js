import "dotenv/config";
import dbService from '../src/services/dbService.js';

const SENDER_PSID = process.argv[2];

async function checkLeads() {
    if (!SENDER_PSID) {
        console.error('Please provide a PSID as an argument.');
        return;
    }
    console.log(`Checking database for PSID: ${SENDER_PSID}`);
    const lead = await dbService.getLead(SENDER_PSID);
    console.log('Lead data:', JSON.stringify(lead, null, 2));
}

checkLeads();
