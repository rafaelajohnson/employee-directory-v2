//ESM
import express from "express";
import employeesRouter from "./routes/employees.js";

const app = express();

// Body parsing for JSON requests
app.use(express.json());

// Root route (kept from v1)
app.get("/", (_req, res) => {
  res.send("Hello employees!");
});

// Mount all /employees routes
app.use("/employees", employeesRouter);

// Catch-all error handler — sends 500 for uncaught errors
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Internal Server Error" : err.message,
  });
});

export default app;

