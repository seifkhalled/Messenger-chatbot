import "dotenv/config";
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

// For local development
let port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log("App is running at the port: " + port);
    });
}

export default app;
