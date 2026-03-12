import chatbotService from "../services/chatbotService.js";

let test = (req, res) => {
    return res.send("Messenger Webhook Server is running!");
}

let getWebhook = (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            return res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(404);
};

let postWebhook = async (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === "page") {

        // Iterates over each entry - there may be multiple if batched
        for (const entry of body.entry) {
            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            if (entry.messaging && entry.messaging[0]) {
                let webhook_event = entry.messaging[0];

                // Extract PSID and message text
                let sender_psid = webhook_event.sender.id;
                console.log('Sender PSID: ' + sender_psid);

                if (webhook_event.message && webhook_event.message.text) {
                    let message_text = webhook_event.message.text;
                    console.log('Message received: ' + message_text);

                    // Create the response object
                    let response = {
                        "text": `You sent the message: "${message_text}". This is an automated reply from Vercel!`
                    };

                    // Send the response
                    await chatbotService.callSendAPI(sender_psid, response);
                }
            }
        }

        // Returns a '200 OK' response to all requests
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        return res.sendStatus(404);
    }
};

export default {
    test: test,
    getWebhook: getWebhook,
    postWebhook: postWebhook
}