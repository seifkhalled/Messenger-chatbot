import express from "express";
import chatbotController from "../controllers/chatbotController.js";

let router = express.Router();

let initWebRoutes = (app) => {

    router.get("/" , chatbotController.test); 
    router.get("/init-db", async (req, res) => {
        const dbService = (await import("../services/dbService.js")).default;
        await dbService.initDB();
        res.send("Database initialized (leads table created).");
    });
    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);
 
    return app.use("/" , router);
};

export default initWebRoutes;