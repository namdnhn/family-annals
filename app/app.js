require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const dbURI = process.env.DB_CONNECT;

//routes
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    // const data = error.data;
    // res.status(status).json({ message: message, data: data });
    res.status(status).json({ message: message });
});

mongoose
    .connect(dbURI)
    .then((result) => {
        console.log('Connected to database');
        app.listen(8080);
    })
    .catch((err) => console.log(err));
