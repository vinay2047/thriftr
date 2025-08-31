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
import logCheckRoutes from "./routes/checklogs.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { logRequests } from "./middlewares/requestlogs.middleware.js";
import { swaggerSpec } from "./swagger.js";
import swaggerUi from "swagger-ui-express";
import path from "path";

const app=express();
const port=process.env.PORT|| 3000;
const __dirname = path.resolve();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequests);

app.use("/api",logCheckRoutes)
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/orders",orderRoutes);


if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

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