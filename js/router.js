import { renderNotes } from './notes.js'
import { renderTasks } from './tasks.js'
import { renderGoals } from './goals.js'
import { updateTopbar } from './topbar.js'
import { setActiveRoute } from './sidebar.js'

const routes = {
  '/notes': renderNotes,
  '/tasks': renderTasks,
  '/goals': renderGoals,
}

export function initRouter() {
  window.addEventListener('hashchange', render)
  render()
}

export function navigate(path) {
  location.hash = path
}

function render() {
  const path = location.hash.replace('#', '') || '/notes'
  const view = routes[path] || renderNotes

  view()
  updateTopbar(path)
  setActiveRoute(path)
}
