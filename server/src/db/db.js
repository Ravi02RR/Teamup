import mongoose from "mongoose"
export const dbConnection = (uri) => {

    try {
        mongoose.connect(uri);
        console.log("Database connected");
    } catch (err) {
        console.log("Database connection failed");
        process.exit(1);
    }
}