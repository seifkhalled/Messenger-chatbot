import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'database', 'leads.csv');

/**
 * Ensures the CSV file exists.
 */
const initCSV = () => {
    const dir = path.dirname(CSV_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(CSV_PATH)) {
        fs.writeFileSync(CSV_PATH, 'PSID,Name,Phone,LastMessage,Timestamp\n');
    }
};

/**
 * Gets a lead by PSID.
 * @param {string} psid 
 */
const getLead = (psid) => {
    initCSV();
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns[0] === psid) {
            return {
                psid: columns[0],
                name: columns[1],
                phone: columns[2],
                lastMessage: columns[3],
                timestamp: columns[4]
            };
        }
    }
    return null;
};

/**
 * Saves or updates a lead.
 * @param {object} lead 
 */
const saveLead = (lead) => {
    initCSV();
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    let lines = data.split('\n');
    let found = false;

    const newLine = `${lead.psid},${lead.name || ''},${lead.phone || ''},"${(lead.lastMessage || '').replace(/"/g, '""')}",${new Date().toISOString()}`;

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].split(',')[0] === lead.psid) {
            lines[i] = newLine;
            found = true;
            break;
        }
    }

    if (!found) {
        lines.push(newLine);
    }

    fs.writeFileSync(CSV_PATH, lines.filter(line => line.trim() !== '').join('\n') + '\n');
};

export default {
    getLead,
    saveLead
};
