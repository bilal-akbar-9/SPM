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
const medicineRoutes = require("./routes/MedicineRoutes");
const supplierRoutes = require("./routes/SupplierRoutes");
const inventoryRoutes=require('./routes/InventoryRoutes');



//Express app intialization
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
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
app.use("/pharmacy-api/medicine", medicineRoutes);
app.use("/pharmacy-api/suppliers", supplierRoutes);
app.use("/pharmacy-api/inventoryservices",inventoryRoutes);

//Listen to port
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});