import { navigate } from './router.js'
import { toggleTheme } from './theme.js'

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar')

  sidebar.innerHTML = `
    <nav class="sidebar-nav">
      <div class="sidebar-item" data-route="/notes">📝 <span>Notas</span></div>
      <div class="sidebar-item" data-route="/tasks">✅ <span>Tarefas</span></div>
      <div class="sidebar-item" data-route="/goals">🎯 <span>Metas</span></div>

      <button id="toggle-theme" class="theme-toggle">🌙</button>
    </nav>
  `

  sidebar.querySelectorAll('.sidebar-item').forEach(item => {
    item.onclick = () => navigate(item.dataset.route)
  })

  document.getElementById('toggle-theme').onclick = toggleTheme
}

export function setActiveRoute(path) {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === path)
  })
}
