import { loadData, saveData } from './storage.js'

export function renderGoals() {
  const app = document.getElementById('app')
  const data = loadData()

  app.innerHTML = `
    <section class="goals-page">
      <form id="goal-form">
        <input id="goal-input" placeholder="Nova meta..." required />
        <button>Adicionar</button>
      </form>

      <div id="goals-list"></div>
    </section>
  `

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  function renderGoalsList() {
    const list = document.getElementById('goals-list')
    list.innerHTML = ''

    data.goals.forEach(goal => {
      const card = document.createElement('div')
      card.className = 'goal-card'

      card.innerHTML = `
        <div class="goal-header">
          <input class="goal-title" value="${goal.title}" />
          <button class="delete">✖</button>
        </div>

        <div class="goal-actions">
          <button data-value="green">🟢</button>
          <button data-value="yellow">🟡</button>
          <button data-value="red">🔴</button>
        </div>

        <div class="goal-history">
          ${goal.history.map((h, i) => `
            <span
              class="dot ${h.value}"
              title="${h.date} – clique para remover"
              data-index="${i}">
            </span>
          `).join('')}
        </div>

        <div class="goal-panel">
          <canvas class="goal-chart" height="80"></canvas>
        </div>
      `

      /* editar título */
      card.querySelector('.goal-title').oninput = e => {
        goal.title = e.target.value
        saveData(data)
      }

      /* remover meta */
      card.querySelector('.delete').onclick = () => {
        data.goals = data.goals.filter(g => g.id !== goal.id)
        saveData(data)
        renderGoalsList()
      }

      /* remover pin */
      card.querySelectorAll('.dot').forEach(dot => {
        dot.onclick = () => {
          goal.history.splice(Number(dot.dataset.index), 1)
          saveData(data)
          renderGoalsList()
        }
      })

      /* adicionar pin manual */
      card.querySelectorAll('.goal-actions button').forEach(btn => {
        btn.onclick = () => {
          goal.history.push({
            date: today(),
            value: btn.dataset.value,
            source: 'manual',
            timestamp: Date.now()
          })

          saveData(data)
          renderGoalsList()
        }
      })

      /* gráfico da meta */
      const ctx = card.querySelector('.goal-chart')
      const countByDate = {}

      goal.history.forEach(h => {
        if (h.value === 'green') {
          countByDate[h.date] = (countByDate[h.date] || 0) + 1
        }
      })

      if (Object.keys(countByDate).length > 0) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: Object.keys(countByDate),
            datasets: [{
              data: Object.values(countByDate),
              tension: 0.3
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        })
      }

      list.appendChild(card)
    })
  }

  document.getElementById('goal-form').onsubmit = e => {
    e.preventDefault()

    data.goals.push({
      id: crypto.randomUUID(),
      title: document.getElementById('goal-input').value,
      history: []
    })

    saveData(data)
    renderGoalsList()
    e.target.reset()
  }

  renderGoalsList()
}