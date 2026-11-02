import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google's DNS for resolving MongoDB SRV records
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
}

export default connectDb;