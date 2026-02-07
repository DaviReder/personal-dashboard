import { loadData, saveData } from './storage.js'

export function renderNotes() {
  const app = document.getElementById('app')
  const data = loadData()

  if (!data.notes) data.notes = []

  app.innerHTML = `
    <section class="notes-page">
      <form id="note-form">
        <input id="note-title" placeholder="Título da anotação" required />
        <button>Adicionar</button>
      </form>

      <div id="notes-list"></div>
    </section>
  `

  const list = document.getElementById('notes-list')

  function renderList() {
    list.innerHTML = ''

    data.notes.forEach(note => {
      const div = document.createElement('div')
      div.className = 'note-card'

      div.innerHTML = `
        <input class="note-title" value="${note.title}" />
        <textarea class="note-content">${note.content}</textarea>
        <button class="delete">Excluir</button>
      `

      div.querySelector('.note-title').oninput = e => {
        note.title = e.target.value
        saveData(data)
      }

      div.querySelector('.note-content').oninput = e => {
        note.content = e.target.value
        saveData(data)
      }

      div.querySelector('.delete').onclick = () => {
        data.notes = data.notes.filter(n => n.id !== note.id)
        saveData(data)
        renderList()
      }

      list.appendChild(div)
    })
  }

  document.getElementById('note-form').onsubmit = e => {
    e.preventDefault()

    data.notes.push({
      id: crypto.randomUUID(),
      title: document.getElementById('note-title').value,
      content: ''
    })

    saveData(data)
    renderList()
    e.target.reset()
  }

  renderList()
}
