import express from "express";
import bodyParser from "body-parser";
import viewEngine from "../src/config/viewEngine.js";
import initWebRoutes from "../src/routes/web.js";

const app = express();

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view engine
viewEngine(app);

// Init web routes
initWebRoutes(app);

// Explicit webhook verification for Vercel compatibility
app.get("/webhook", (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            return res.status(200).send(challenge);
        } else {
            console.error("Webhook verification failed. Token mismatch.");
            return res.sendStatus(403);
        }
    }
    return res.status(404).send("Invalid request");
});

// For local development
let port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log("App is running at the port: " + port);
    });
}

export default app;
