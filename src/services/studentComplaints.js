const storageKey = 'sumpyo-student-complaints'

function stamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function loadStudentComplaints() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveStudentComplaint({ room, categories, content }) {
  const labels = categories.filter(Boolean)
  const note = content.trim()
  const item = {
    id: `local-${Date.now()}`,
    local: true,
    status: 'received',
    badge: '접수',
    room,
    categoryLabels: labels,
    place: labels.length ? `${room} · ${labels.join(' · ')}` : room,
    body: note || labels.join(' · '),
    createdAt: stamp(),
  }
  const next = [item, ...loadStudentComplaints()]
  localStorage.setItem(storageKey, JSON.stringify(next))
  return item
}
