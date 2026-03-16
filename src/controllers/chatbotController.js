import chatbotService from "../services/chatbotService.js";
import dbService from "../services/dbService.js";

let test = (req, res) => {
    return res.send("Messenger Webhook Server is running with Supabase!");
}

let getWebhook = (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(404);
};

let postWebhook = async (req, res) => {
    let body = req.body;

    if (body.object === "page") {
        for (const entry of body.entry) {
            if (entry.messaging && entry.messaging[0]) {
                let webhook_event = entry.messaging[0];
                let sender_psid = webhook_event.sender.id;

                if (webhook_event.message) {
                    if (!webhook_event.message.text) return res.status(200).send("EVENT_RECEIVED");
                    
                    let text = webhook_event.message.text;
                    console.log(`[${sender_psid}] Message: ${text}`);

                    // Fetch user from Supabase
                    const lead = await dbService.getLead(sender_psid);

                    if (!lead) {
                        // STATE 1 — No record in DB (new user)
                        await dbService.saveLead({ psid: sender_psid, state: 'ASKED_NAME' });
                        await chatbotService.callSendAPI(sender_psid, { "text": "Hello! 👋 What's your name?" });
                    } else if (lead.state === 'ASKED_NAME') {
                        // STATE 2 — state === 'ASKED_NAME'
                        await dbService.saveLead({ 
                            psid: sender_psid, 
                            name: text, 
                            state: 'ASKED_PHONE' 
                        });
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": `Nice to meet you, ${text}! What's your phone number?` 
                        });
                    } else if (lead.state === 'ASKED_PHONE') {
                        // STATE 3 — state === 'ASKED_PHONE'
                        await dbService.saveLead({ 
                            psid: sender_psid, 
                            name: lead.name,
                            phone: text, 
                            state: 'COMPLETED' 
                        });
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": "Thank you! ✅ Our team will contact you soon." 
                        });
                    } else if (lead.state === 'COMPLETED') {
                        // STATE 4 — state === 'COMPLETED'
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": "We already have your details. Our team will reach out shortly!" 
                        });
                    }
                }
            }
        }
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
};

export default {
    test: test,
    getWebhook: getWebhook,
    postWebhook: postWebhook
}