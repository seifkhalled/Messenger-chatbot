/**
 * Sends a message back to the user via the Facebook Send API.
 * 
 * @param {string} sender_psid - The Page Scoped ID of the user.
 * @param {object} response - The message object to send.
 */
const callSendAPI = async (sender_psid, response) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    // Construct the message body
    const request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request_body)
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Message sent successfully!', data);
        } else {
            console.error('Unable to send message:', data);
        }
    } catch (err) {
        console.error('Error while calling Send API:', err);
    }
};

export default {
    callSendAPI
};
