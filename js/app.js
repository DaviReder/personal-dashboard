import { renderTasks } from './tasks.js'
import { renderGoals } from './goals.js'
import { renderNotes } from './notes.js'

import { initTheme } from './theme.js'
import { renderSidebar } from './sidebar.js'
import { renderTopbar, updateTopbar } from './topbar.js'
import { navigate } from './router.js'

const routes = {
  '/tasks': renderTasks,
  '/goals': renderGoals,
  '/notes': renderNotes
}

function router() {
  const path = location.hash.replace('#', '') || '/tasks'
  const render = routes[path]

  if (render) {
    updateTopbar(path)
    render()
  }
}

window.addEventListener('hashchange', router)

/* BOOTSTRAP */
initTheme()
renderSidebar()
renderTopbar()

/* rota inicial */
if (!location.hash) {
  navigate('/tasks')
} else {
  router()
}
