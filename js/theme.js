export function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    document.body.classList.add('dark')
  }
}

export function toggleTheme() {
  document.body.classList.toggle('dark')
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  )
}
