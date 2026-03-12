import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";

let app = express();

//config view engine
viewEngine(app);

// config body-parser

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}));


//init web routes

initWebRoutes(app);

let port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port , () => {
        console.log("App is running at the port:" + port);
    })
}

export default app;
