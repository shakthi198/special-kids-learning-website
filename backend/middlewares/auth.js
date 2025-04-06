import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password"); // Exclude password for security

      if (!req.user) {
        console.log("❌ User not found in database");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("✅ User authenticated:", req.user._id);
      next();
    } catch (error) {
      console.error("❌ Token error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
};
