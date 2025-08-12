// updated this js since I already have the routes to keep this separate
const express = require("express");
const employeesRouter = require("./routes/employees");

const app = express();

// JSON body parsing (needed for POST /employees)
app.use(express.json());

// root route
app.get("/", (_req, res) => {
  res.send("Hello employees");
});

// mount all /employees routes here
app.use("/employees", employeesRouter);

// catch-all error handler (500 for uncaught)
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Internal Server Error" : err.message,
  });
});

module.exports = app;
