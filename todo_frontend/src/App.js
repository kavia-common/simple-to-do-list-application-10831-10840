import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App - Minimalist Pure White themed Todo application.
 * Features:
 * - Add new todo by typing and pressing Enter or clicking Add
 * - List todos with clean, simple presentation
 * - Delete a todo with a subtle action button
 * - LocalStorage persistence (optional enhancement while remaining minimal)
 */
function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos:minimal');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');

  // Keep storage in sync for simple persistence between reloads
  useEffect(() => {
    try {
      localStorage.setItem('todos:minimal', JSON.stringify(todos));
    } catch {
      // Ignore storage errors to keep UX clean
    }
  }, [todos]);

  const canAdd = useMemo(() => input.trim().length > 0, [input]);

  // PUBLIC_INTERFACE
  const handleAdd = () => {
    if (!canAdd) return;
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setInput('');
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="App app-bg">
      <main className="container">
        <header className="header">
          <h1 className="title">Tasks</h1>
          <p className="subtitle">A clean, simple list to keep you focused.</p>
        </header>

        <section className="inputRow" aria-label="Add a new task">
          <input
            className="textInput"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Task name"
          />
          <button
            className={`btn ${canAdd ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handleAdd}
            disabled={!canAdd}
            aria-disabled={!canAdd}
          >
            Add
          </button>
        </section>

        <section className="listSection" aria-live="polite" aria-label="Todo list">
          {todos.length === 0 ? (
            <div className="emptyState" role="status">
              No tasks yet. Start by adding one above.
            </div>
          ) : (
            <ul className="todoList">
              {todos.map((t) => (
                <li key={t.id} className="todoItem">
                  <span className="todoText">{t.text}</span>
                  <button
                    className="iconBtn"
                    aria-label={`Delete "${t.text}"`}
                    onClick={() => handleDelete(t.id)}
                    title="Delete"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
