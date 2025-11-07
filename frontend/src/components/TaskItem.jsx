
import React from "react";

export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <li className={`task-item ${task.completed ? "done" : ""}`}>
      <span className="title">{task.title}</span>
      <div className="actions">
        <button onClick={() => onEdit(task)}>Editar</button>
        <button onClick={onDelete}>Eliminar</button>
      </div>
    </li>
  );
}
