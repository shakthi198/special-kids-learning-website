import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { authRoutes } from "./routes/auth.js";
import courseRoutes from "./routes/courseRoutes.js";

//Initialize express
const app = express();

// connect to db
await connectDB();

//Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//Routes
app.use("/api/users", authRoutes);
app.use("/api/courses", courseRoutes);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
