import { useState } from 'react'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { Counter } from './Counter'
import { useStore } from './store'
import './styles.css'

export default function App() {
  const [task, setTask] = useState('')
  const username = useStore((state) => state.username)
  const setUsername = useStore((state) => state.setUsername)
  const todos = useStore((state) => state.todos)
  const addTodo = useStore((state) => state.addTodo)

  const handleAddTodo = () => {
    if (!task.trim()) return
    addTodo(task.trim())
    setTask('')
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">React Royale Starter</p>
          <h1>
            <Sparkles size={28} /> Build something magical
          </h1>
          <p className="muted">
            Use multiple files, Zustand for global state, motion for animations, and
            Tailwind-friendly utility classes.
          </p>
        </div>
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <label className="label" htmlFor="name">
            Project owner
          </label>
          <input
            id="name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Sandpack legend"
          />
          <p className="muted small">Share who is behind your component.</p>
        </motion.div>
      </header>

      <section className="panel-grid">
        <div className="panel">
          <h2>Global state with Zustand</h2>
          <div className="todo-form">
            <input
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="Add todo"
            />
            <button type="button" onClick={handleAddTodo}>
              Add
            </button>
          </div>
          <ul className="todo-list">
            {todos.map((item) => (
              <li key={item.id}>
                <span>{item.text}</span>
                <span className="muted small">by {username || 'Anonymous'}</span>
              </li>
            ))}
            {todos.length === 0 && <p className="muted">Start by adding a task.</p>}
          </ul>
        </div>
        <div className="panel">
          <h2>Reusable components</h2>
          <p className="muted">Anything you render here will appear in the public gallery.</p>
          <Counter />
        </div>
      </section>
    </div>
  )
}
