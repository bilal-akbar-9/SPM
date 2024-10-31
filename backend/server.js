const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

//Routes
const pharmacyRoutes = require("./routes/PharmacyRoutes");
const analyticsRoutes = require("./routes/AnalyticsRoutes");
const prescriptionRoutes = require("./routes/PrescriptionRoutes");
const userRoutes = require("./routes/UserRoutes");


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
app.use("/pharmacy-api/pharmacies", pharmacyRoutes);
app.use("/pharmacy-api/analytics", analyticsRoutes);
app.use("/pharmacy-api/prescriptions", prescriptionRoutes);
app.use("/pharmacy-api/users", userRoutes);

//Listen to port
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});