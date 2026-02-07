export function renderTopbar() {
  document.getElementById('topbar').innerHTML = `
    <h1></h1>
    <div id="topbar-actions"></div>
  `
}

export function updateTopbar(path) {
  const titles = {
    '/notes': 'Anotações',
    '/tasks': 'Tarefas',
    '/goals': 'Metas'
  }

  document.querySelector('#topbar h1').textContent =
    titles[path] || ''
}
