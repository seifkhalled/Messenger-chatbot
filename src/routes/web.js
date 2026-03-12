import express from "express";
import chatbotController from "../controllers/chatbotController.js";

let router = express.Router();

let initWebRoutes = (app) => {

    router.get("/" , chatbotController.test); 
    router.get("/init-db", async (req, res) => {
        res.send("For Supabase, please run the SQL setup script found in /docs/supabase_setup.sql directly in your Supabase SQL Editor.");
    });
    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);
 
    return app.use("/" , router);
};

export default initWebRoutes;