import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
dotenv.config();

const port = process.env.PORT


const app = express()
app.use(express.json())
app.use("/",router)
app.get("/", (req, res) => {
    res.json({ message: "Hello from Auth" });
})

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Auth is running on port ${port}`);
    });
});