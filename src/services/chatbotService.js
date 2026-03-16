/**
 * Sends a message back to the user via the Facebook Send API.
 * 
 * @param {string} sender_psid - The Page Scoped ID of the user.
 * @param {object} response - The message object to send.
 */
const callSendAPI = async (sender_psid, message) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    if (!PAGE_ACCESS_TOKEN) {
        console.error("❌ PAGE_ACCESS_TOKEN is missing!");
        return;
    }
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    const payload = {
        recipient: { id: sender_psid },
        message: message,
        messaging_type: "RESPONSE"
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.error) {
            console.error("❌ Unable to send message:", data.error);
        } else {
            console.log(`✅ Message sent to ${sender_psid}`);
        }
    } catch (err) {
        console.error("❌ Error while calling Send API:", err);
    }
};

export default {
    callSendAPI
};
