import chatbotService from "../services/chatbotService.js";
import csvService from "../services/csvService.js";

let test = (req, res) => {
    return res.send("Messenger Webhook Server is running!");
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
                    let message_text = webhook_event.message.text;
                    console.log(`[${sender_psid}] Message: ${message_text}`);

                    // 1. Check if user exists in our CSV "database"
                    let lead = csvService.getLead(sender_psid);
                    let response_text = "";

                    if (!lead) {
                        // User is new -> Ask for Name
                        csvService.saveLead({
                            psid: sender_psid,
                            lastMessage: message_text
                        });
                        response_text = "Hello! I'm your assistant. Can you please tell me your name?";
                    } else if (!lead.name) {
                        // User exists but no Name -> Save message as Name, then ask for Phone
                        lead.name = message_text;
                        lead.lastMessage = message_text;
                        csvService.saveLead(lead);
                        response_text = `Nice to meet you, ${message_text}! Now, please tell me your phone number so we can reach out.`;
                    } else if (!lead.phone) {
                        // User has Name but no Phone -> Save message as Phone
                        lead.phone = message_text;
                        lead.lastMessage = message_text;
                        csvService.saveLead(lead);
                        response_text = "Thank you! We've received your information and our team will contact you soon.";
                    } else {
                        // Lead is complete
                        response_text = "Thanks again for your interest! We already have your details. Is there anything else you'd like to know?";
                    }

                    // Send the reply
                    await chatbotService.callSendAPI(sender_psid, { "text": response_text });
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