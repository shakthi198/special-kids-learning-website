import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { authRoutes } from "./routes/auth.js";
import courseRoutes from "./routes/courseRoutes.js";

const startServer = async () => {
  // connect to db
  await connectDB();
  //Initialize express
  const app = express();
  //Middleware
  app.use(express.json());
  app.use(cors({ origin: "https://unikid.onrender.com", credentials: true }));

  //Routes
  app.use("/api/users", authRoutes);
  app.use("/api/courses", courseRoutes);

  app.get("/", (req, res) => {
    res.send("API is running");
  });

  //port
  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
};
startServer();
