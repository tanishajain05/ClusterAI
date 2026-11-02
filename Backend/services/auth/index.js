import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy"
import connectDb from "./config/db.js";
dotenv.config();
import cors from "cors";

const port = process.env.PORT


const app = express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use("/",router)

app.use("/auth",proxy(process.env.AUTH_SERVICE))
app.get("/", (req, res) => {
    res.json({ message: "Hello from Auth" });
})

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Auth is running on port ${port}`);
    });
});