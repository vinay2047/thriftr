import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {connectDB} from "./lib/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import reviewRoutes from "./routes/review.routes.js";

import { swaggerSpec } from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app=express();
const port=process.env.PORT|| 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/review",reviewRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
      console.log(`📖 Swagger docs available at http://localhost:${port}/api-docs`);
});