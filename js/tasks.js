import { loadData, saveData } from './storage.js'

export function renderTasks() {
  const app = document.getElementById('app')
  const data = loadData()

  app.innerHTML = `
    <section class="tasks-page">
      <form id="task-form">
        <input id="task-input" placeholder="Nova tarefa..." required />

        <select id="task-goal">
          <option value="">Sem meta</option>
          ${data.goals.map(g => `
            <option value="${g.id}">${g.title}</option>
          `).join('')}
        </select>

        <button>Adicionar</button>
      </form>

      <h3>Pendentes</h3>
      <ul id="tasks-open"></ul>

      <h3>Concluídas</h3>
      <ul id="tasks-done"></ul>

      <h3>Calendário</h3>
      <div class="calendar-wrapper">
        <div id="calendar-container"></div>
      </div>
    </section>
  `

  const openList = document.getElementById('tasks-open')
  const doneList = document.getElementById('tasks-done')

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  function registerGoalProgress(goalId) {
    const goal = data.goals.find(g => g.id === goalId)
    if (!goal) return
    goal.history.push({
      date: today(),
      value: 'green',
      source: 'task',
      timestamp: Date.now()
    })
  }

  /* ================= LISTAS ================= */
  function renderList() {
    openList.innerHTML = ''
    doneList.innerHTML = ''

    data.tasks.forEach(task => {
      const goal = data.goals.find(g => g.id === task.goalId)

      const li = document.createElement('li')
      li.className = task.completed ? 'completed' : ''
      li.draggable = true

      li.innerHTML = `
        <label>
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          ${task.title}
        </label>

        ${goal ? `<small>🎯 ${goal.title}</small>` : ''}

        <button class="remove">✖</button>
      `

      li.ondragstart = e => {
        e.dataTransfer.setData(
          'application/json',
          JSON.stringify({ taskId: task.id })
        )
      }

      li.querySelector('input').onchange = () => {
        task.completed = !task.completed
        if (task.completed && task.goalId) {
          registerGoalProgress(task.goalId)
        }
        saveData(data)
        renderTasks()
      }

      li.querySelector('.remove').onclick = () => {
        data.tasks = data.tasks.filter(t => t.id !== task.id)
        saveData(data)
        renderTasks()
      }

      ;(task.completed ? doneList : openList).appendChild(li)
    })
  }

  /* ================= FORM ================= */
  document.getElementById('task-form').onsubmit = e => {
    e.preventDefault()
    data.tasks.push({
      id: crypto.randomUUID(),
      title: document.getElementById('task-input').value,
      completed: false,
      createdAt: Date.now(),
      goalId: document.getElementById('task-goal').value || null
    })
    saveData(data)
    renderTasks()
  }

  /* ================= CALENDÁRIO ================= */
  const calendarContainer = document.getElementById('calendar-container')
  calendarContainer.appendChild(renderWeekCalendar(data))

  renderList()
}

/* ================================================= */
/* =============== CALENDÁRIO SEMANAL ============== */
/* ================================================= */
function renderWeekCalendar(data) {
  const tasks = data.tasks
  const calendar = document.createElement('div')
  calendar.className = 'week-calendar'

  /* COLUNA DE HORAS */
  const hoursCol = document.createElement('div')
  hoursCol.className = 'calendar-hours'

  const spacer = document.createElement('div')
  spacer.className = 'calendar-day-header'
  hoursCol.appendChild(spacer)

  for (let h = 6; h <= 22; h++) {
    const hour = document.createElement('div')
    hour.className = 'calendar-hour'
    hour.textContent = `${h}:00`
    hoursCol.appendChild(hour)
  }

  calendar.appendChild(hoursCol)

  /* DIAS */
  const base = new Date()
  for (let d = 0; d < 7; d++) {
    const date = new Date(base)
    date.setDate(base.getDate() + d)
    const dateStr = date.toISOString().split('T')[0]

    const dayCol = document.createElement('div')
    dayCol.className = 'calendar-day'

    const header = document.createElement('div')
    header.className = 'calendar-day-header'
    header.textContent = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
    dayCol.appendChild(header)

    for (let h = 6; h <= 22; h++) {
      const slot = document.createElement('div')
      slot.className = 'calendar-slot'

      /* DROP */
      slot.ondragover = e => e.preventDefault()
      slot.ondrop = e => {
        e.preventDefault()
        const { taskId } = JSON.parse(
          e.dataTransfer.getData('application/json')
        )
        const task = tasks.find(t => t.id === taskId)
        if (!task) return
        task.schedule = {
          day: dateStr,
          start: `${String(h).padStart(2, '0')}:00`,
          duration: 60
        }
        saveData(data)
        renderTasks()
      }

      /* CLIQUE */
      slot.onclick = () => {
        const title = prompt(
          `Nova tarefa em ${date.toLocaleDateString('pt-BR')} às ${h}:00`
        )
        if (!title) return
        tasks.push({
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: Date.now(),
          goalId: null,
          schedule: {
            day: dateStr,
            start: `${String(h).padStart(2, '0')}:00`,
            duration: 60
          }
        })
        saveData(data)
        renderTasks()
      }

      dayCol.appendChild(slot)
    }

    /* BLOCOS */
    tasks
      .filter(t => t.schedule && t.schedule.day === dateStr)
      .forEach(task => {
        const block = document.createElement('div')
        block.className = 'calendar-task'
        block.textContent = task.title
        block.draggable = true
        block.ondragstart = e => {
          e.dataTransfer.setData(
            'application/json',
            JSON.stringify({ taskId: task.id })
          )
        }
        const [hour, minute] = task.schedule.start.split(':').map(Number)
        block.style.top = `${40 + (hour - 6) * 60 + minute}px`
        block.style.height = `${task.schedule.duration}px`
        dayCol.appendChild(block)
      })

    calendar.appendChild(dayCol)
  }

  return calendar
}

