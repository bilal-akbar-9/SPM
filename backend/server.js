const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

//Routes


//Express app intialization
const app = express();

//Middlewares
app.use(cors(
    {
        // origin: process.env.FRONTEND_URL,
        origin: [process.env.FRONTEND_URL],
        credentials: true,
    }
));

//DB config
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_STRING, {});
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

//Routes initialization

//Listen to port
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});