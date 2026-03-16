const WEBHOOK_URL = 'http://localhost:3000/webhook';
const SENDER_PSID = 'test_user_psid_' + Date.now();

async function sendWebhook(text) {
    console.log(`\n--- Sending: "${text}" ---`);
    const payload = {
        object: 'page',
        entry: [{
            messaging: [{
                sender: { id: SENDER_PSID },
                message: { text: text }
            }]
        }]
    };

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.text();
        console.log('Server Response:', res.status, data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function runTest() {
    console.log('Starting Lead Collection Test...');

    // 1. New user -> STATE 1
    console.log('Expected: STATE 1 (Ask Name)');
    await sendWebhook('Hello');

    // Wait a bit for async operations
    await new Promise(r => setTimeout(r, 1000));

    // 2. Send Name -> STATE 2
    console.log('Expected: STATE 2 (Save Name, Ask Phone)');
    await sendWebhook('John Doe');

    await new Promise(r => setTimeout(r, 1000));

    // 3. Send Phone -> STATE 3
    console.log('Expected: STATE 3 (Save Phone, Complete)');
    await sendWebhook('0612345678');

    await new Promise(r => setTimeout(r, 1000));

    // 4. Send Message after completed -> STATE 4
    console.log('Expected: STATE 4 (Already completed)');
    await sendWebhook('Are you there?');
}

runTest();
