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

                if (webhook_event.message && webhook_event.message.text) {
                    let text = webhook_event.message.text;
                    console.log(`[${sender_psid}] Message: ${text}`);

                    // Fetch user from Supabase
                    const lead = await dbService.getLead(sender_psid);

                    if (!lead) {
                        // 1. New user -> Ask for Name
                        await dbService.saveLead({ psid: sender_psid, state: 'ASKED_NAME' });
                        await chatbotService.callSendAPI(sender_psid, { "text": "Hello! I'm your assistant. What's your name?" });
                    } else if (lead.state === 'ASKED_NAME') {
                        // 2. Name received -> Store name and ask for Phone
                        await dbService.saveLead({ 
                            psid: sender_psid, 
                            name: text, 
                            state: 'ASKED_PHONE' 
                        });
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": `Nice to meet you, ${text}! Please tell me your phone number so we can reach out.` 
                        });
                    } else if (lead.state === 'ASKED_PHONE') {
                        // 3. Phone received -> Store phone and mark as Completed
                        await dbService.saveLead({ 
                            psid: sender_psid, 
                            name: lead.name,
                            phone: text, 
                            state: 'COMPLETED' 
                        });
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": "Thank you! We've received your information and our team will contact you soon." 
                        });
                    } else {
                        // 4. Flow already completed -> Handle follow-up or general info
                        await chatbotService.callSendAPI(sender_psid, { 
                            "text": "Thanks again! We have your details. How else can I help you today?" 
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