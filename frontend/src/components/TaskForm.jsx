import React, { useEffect, useState } from "react";

export default function TaskForm({ apiUrl, editingTask, onSaved }) {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCompleted(editingTask.completed);
    } else {
      setTitle("");
      setCompleted(false);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      alert("El título no puede estar vacío");
      return;
    }

    const isDuplicate = tasks.some(
      (t) =>
        t.title.toLowerCase() === trimmed.toLowerCase() &&
        (!editingTask || t.id !== editingTask.id)
    );

    if (isDuplicate) {
      alert("Ya existe una tarea con ese título, por favor nombra la tarea de otra manera");
      return;
    }

    try {
      const method = editingTask ? "PUT" : "POST";
      const url = editingTask
        ? `${apiUrl}/api/tasks/${editingTask.id}`
        : `${apiUrl}/api/tasks`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed, completed }),
      });

      if (!res.ok) throw new Error("Error al guardar la tarea");

      await res.json();
      window.dispatchEvent(new Event("tasks:updated"));
      onSaved();
      setTitle("");
      setCompleted(false);

      const updated = await fetch(`${apiUrl}/api/tasks`).then((r) => r.json());
      setTasks(updated);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completada
      </label>
      <button type="submit">{editingTask ? "Actualizar" : "Agregar"}</button>
    </form>
  );
}
