import { create } from 'zustand'

let id = 0

export const useStore = create((set) => ({
  username: 'React Royale Participant',
  todos: [],
  count: 0,
  setUsername: (username) => set({ username }),
  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: ++id, text }],
    })),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: Math.max(0, state.count - 1) })),
}))
