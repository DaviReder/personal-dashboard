const KEY = 'personal_dashboard'

export function loadData() {
  return JSON.parse(localStorage.getItem(KEY)) || {
    notes: [],
    tasks: [],
    goals: []
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
