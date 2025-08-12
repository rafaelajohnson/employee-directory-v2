
const express = require("express");
const path = require("path");

// load the shared in-memory array
const employees = require(path.resolve(__dirname, "..", "db", "employees.json"));

const router = express.Router();

// GET /employees -> list all
router.get("/", (_req, res) => {
  res.json(employees);
});

// define /random BEFORE /:id so "random" isn't treated as an id
router.get("/random", (_req, res) => {
  const idx = Math.floor(Math.random() * employees.length);
  res.json(employees[idx]);
});

// GET /employees/:id -> one or 404
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = employees.find(e => Number(e.id) === id);
  if (!found) return res.status(404).json({ message: `No employee with id ${id}` });
  res.json(found);
});

// POST /employees -> create new employee
router.post("/", (req, res, next) => {
  try {
    const name = req.body?.name;
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Valid 'name' is required" });
    }

    // unique id: max existing id + 1
    const nextId =
      employees.length ? Math.max(...employees.map(e => Number(e.id) || 0)) + 1 : 1;

    const newEmployee = { id: nextId, name: name.trim() };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
