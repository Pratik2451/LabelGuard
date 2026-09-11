//start the express server in app.js

import express from "express"
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.post("/test", (req, res) => {
    console.log(req.body);
    res.json({
        success: true,
        body: req.body
    });
});

// import expenseRoutes from "./src/routes/expense.routes.js"
// app.use("/api/v1/expense", expenseRoutes);

app.use("/public", express.static("public"));
app.use(express.static("public"));

import userRoutes from "./src/routes/user.routes.js"
app.use("/api/v1/user", userRoutes);

import productRoutes from "./src/routes/product.routes.js"
app.use("/api/v1/products", productRoutes);

export default app;