const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) console.error("Error al conectar con la base de datos:", err);
  else console.log("✅ Conectado a SQLite3");
});

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);


app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const tasks = rows.map((t) => ({
      id: t.id,
      title: t.title,
      completed: !!t.completed,
    }));
    res.json(tasks);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, completed = false } = req.body;
  if (!title || title.trim() === "")
    return res.status(400).json({ error: "Título requerido" });

  db.run(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title.trim(), completed ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, completed });
    }
  );
});

app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { title, completed } = req.body;
  db.run(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    [title.trim(), completed ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title, completed });
    }
  );
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`✅ API escuchando en http://localhost:${PORT}`));

