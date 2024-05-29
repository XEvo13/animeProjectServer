// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

//Import of Middleware
const isAuthenticated = require("./middleware/jwt");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);


//LOGIN ROUTES
const loginRoutes = require("./routes/login.routes");
app.use("/login", loginRoutes);

//PROTECTED ROUTES
const protectedRoutes = require("./routes/protected.routes");
app.use("/login", isAuthenticated, protectedRoutes);

const signupRoutes = require("./routes/signup.routes");
app.use("/api", signupRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
