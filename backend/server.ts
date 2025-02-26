import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = 3000;
const API = "http://127.0.0.1:8000/api";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.get("/tasks", async (req, res) => {
  try {
    const response = await axios.get(`${API}/tasks`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = { title: req.body.title, category: req.body.category };
    const response = await axios.post(`${API}/tasks`, newTask);
    res.json(response.data);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const response = await axios.put(`${API}/tasks/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await axios.delete(`${API}/tasks/${req.params.id}`);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});