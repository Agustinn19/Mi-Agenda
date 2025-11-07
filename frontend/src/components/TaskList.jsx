
import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ apiUrl, onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 🔘 Filtro actual
  const [search, setSearch] = useState(""); // 🔍 Texto de búsqueda

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/tasks`);
      if (!res.ok) throw new Error("Error al obtener tareas");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const onUpdated = () => fetchTasks();
    window.addEventListener("tasks:updated", onUpdated);
    return () => window.removeEventListener("tasks:updated", onUpdated);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error eliminando: " + err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`${apiUrl}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🔍 Filtro combinado: estado (completadas/pendientes/todas) + búsqueda
  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(search.trim().toLowerCase())
    );

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tasks.length === 0) return <p>No hay tareas. ¡Agrega una!</p>;

  return (
    <div>
      {/* 🔍 Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar tarea..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "1rem",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #444",
          backgroundColor: "#2a2a2a",
          color: "white",
        }}
      />

      {/* 🔘 Botones de filtro */}
      <div className="filters" style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completadas
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pendientes
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => handleDelete(task.id)}
            onEdit={() => onEdit(task)}
            onToggle={() => handleToggleComplete(task)}
          />
        ))}
      </ul>
    </div>
  );
}
