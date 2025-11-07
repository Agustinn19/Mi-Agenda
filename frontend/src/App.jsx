import React, { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

export default function App() {
  const [editingTask, setEditingTask] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    document.title = "Mi agenda";
  }, []);

  return (
    <div className="page-container">
      {}
      <header className="header-brand">
        <h1>ForIT Software Factory</h1>
      </header>

      {}
      <main className="container">
        <h2>Mi agenda</h2>
        <TaskForm
          apiUrl={apiUrl}
          editingTask={editingTask}
          onSaved={() => setEditingTask(null)}
        />
        <TaskList apiUrl={apiUrl} onEdit={(task) => setEditingTask(task)} />
      </main>

      {}
      <footer className="footer-signature">
        <p>
          <strong>Agustín Alejandro Quintana</strong>
          <br />
          <span>Egresado de Fundación Empujar</span>
        </p>
      </footer>
    </div>
  );
}

