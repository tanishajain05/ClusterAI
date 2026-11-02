import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";


const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/auth", proxy(process.env.AUTH_service_URL))

app.get("/", (req, res) => {
    res.json({ message: "Gateway is running" });
})

app.listen(port, () => {
    console.log(`Gateway is running on port ${port}`);
})