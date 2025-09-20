import type { Ref } from 'vue'
import type { Area, Labels, Subarea } from '../types'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function createSubarea(id: string): Subarea {
  return { id, label: '', value: 5, note: '', noteVisible: false }
}

export function usePersistence(
  labels: Labels,
  areas: Record<number, Area>,
  selectedDate: Ref<string>,
) {
  const storageKey = (date: string) => `life-balance:${date}`

  const serializeAreas = (): Record<number, { subs: Omit<Subarea, 'noteVisible'>[] }> => {
    const out: Record<number, { subs: Omit<Subarea, 'noteVisible'>[] }> = {}
    for (let i = 0; i < 4; i++) {
      out[i] = {
        subs: areas[i].subs.map((s) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          note: s.note,
        })),
      }
    }
    return out
  }

  const persist = () => {
    try {
      const snapshot = { labels: labels.slice(), areas: serializeAreas() }
      localStorage.setItem(storageKey(selectedDate.value), JSON.stringify(snapshot))
    } catch (e) {
      console.error('Failed to persist data:', e)
    }
  }

  const loadForDate = () => {
    const raw = localStorage.getItem(storageKey(selectedDate.value))
    if (!raw) {
      // Initialize default if not found
      // Clear existing subs
      for (let i = 0; i < 4; i++) {
        areas[i].subs.splice(0, areas[i].subs.length)
      }
      // Add one blank sub each
      for (let i = 0; i < 4; i++) {
        areas[i].subs.push(createSubarea(generateId()))
      }
      persist()
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (parsed.labels && parsed.labels.length === 4) {
        for (let i = 0; i < 4; i++) labels[i] = parsed.labels[i]
      }
      if (parsed.areas) {
        for (let i = 0; i < 4; i++) {
          areas[i].subs.splice(0, areas[i].subs.length) // clear
          const subs = parsed.areas[i].subs || []
          subs.forEach((s: Omit<Subarea, 'noteVisible'>) =>
            areas[i].subs.push({
              id: s.id,
              label: s.label,
              value: s.value || 0,
              note: s.note || '',
              noteVisible: !!s.note,
            }),
          )
        }
      }
    } catch (e) {
      console.error('Failed to load data for date:', e)
    }
  }

  const exportJSON = () => {
    const data = JSON.stringify(
      { date: selectedDate.value, labels: labels.slice(), areas: serializeAreas() },
      null,
      2,
    )
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-balance-${selectedDate.value}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importPrompt = () => {
    const text = prompt('Paste JSON exported from this app')
    if (!text) return
    try {
      const parsed = JSON.parse(text)
      if (parsed.date) selectedDate.value = parsed.date
      if (parsed.labels) {
        for (let i = 0; i < 4; i++) labels[i] = parsed.labels[i]
      }
      if (parsed.areas) {
        for (let i = 0; i < 4; i++) {
          areas[i].subs.splice(0, areas[i].subs.length)
          ;(parsed.areas[i].subs || []).forEach((s: Omit<Subarea, 'noteVisible'>) =>
            areas[i].subs.push({
              id: s.id,
              label: s.label,
              value: s.value || 0,
              note: s.note || '',
              noteVisible: false,
            }),
          )
        }
      }
      persist()
      alert('Imported successfully!')
    } catch (e) {
      alert('Invalid JSON format for import.')
      console.error('Failed to import data:', e)
    }
  }

  return { persist, loadForDate, exportJSON, importPrompt }
}
