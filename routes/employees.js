
import { Router } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname shim for ESM had to check how to do this 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the JSON array once 
const dataPath = path.resolve(__dirname, "..", "db", "employees.json");
const employees = JSON.parse(readFileSync(dataPath, "utf-8"));

const router = Router();

/** GET /employees -> list all employees */
router.get("/", (_req, res) => {
  res.json(employees);
});

/** GET /employees/random -> one random employee
 *  NOTE: define before "/:id" so "random" isn't treated as an id.
 */
router.get("/random", (_req, res) => {
  const idx = Math.floor(Math.random() * employees.length);
  res.json(employees[idx]);
});

/** GET /employees/:id -> employee or 404 */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = employees.find((e) => Number(e.id) === id);
  if (!found) return res.status(404).json({ message: `No employee with id ${id}` });
  res.json(found);
});

/** POST /employees -> create employee
 *  - requires "name" (string, non-empty)
 *  - generates unique id (max+1)
 *  - 201 with the new employee
 *  - 400 if invalid
 */
router.post("/", (req, res, next) => {
  try {
    const name = req.body?.name;
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Valid 'name' is required" });
    }

    const nextId =
      employees.length ? Math.max(...employees.map((e) => Number(e.id) || 0)) + 1 : 1;

    const newEmployee = { id: nextId, name: name.trim() };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    next(err);
  }
});

export default router;
