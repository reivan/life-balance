import { ref, reactive, computed } from 'vue'
import type { Ref } from 'vue'
import type { Area, Labels, Subarea } from '../types'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function createSubarea(id: string): Subarea {
  return { id, label: '', value: 5, note: '', noteVisible: false }
}

export function useLifeBalanceData() {
  const labels: Labels = reactive(['Relationships', 'Finance', 'Health', 'Purpose'])

  const today = new Date().toISOString().slice(0, 10)
  const selectedDate: Ref<string> = ref(today)

  const areas: Record<number, Area> = reactive({
    0: { subs: [createSubarea(generateId()), createSubarea(generateId())] },
    1: { subs: [createSubarea(generateId())] },
    2: {
      subs: [createSubarea(generateId()), createSubarea(generateId()), createSubarea(generateId())],
    },
    3: { subs: [createSubarea(generateId())] },
  })

  const selectedArea: Ref<number | null> = ref(null)

  const avgFor = (i: number): number => {
    const list = areas[i].subs
    if (!list || list.length === 0) return 0
    const sum = list.reduce((a, b) => a + (Number(b.value) || 0), 0)
    return sum / list.length
  }

  const overallScore = computed((): number => {
    const vals = [0, 1, 2, 3].map((i) => avgFor(i))
    const nonzero = vals.filter((v) => !isNaN(v) && v !== 0)
    const sum = nonzero.reduce((a, b) => a + b, 0)
    return nonzero.length ? sum / nonzero.length : 0
  })

  const toggleArea = (i: number) => {
    selectedArea.value = selectedArea.value === i ? null : i
  }

  const collapse = () => {
    selectedArea.value = null
  }

  const addSubarea = () => {
    if (selectedArea.value !== null) {
      const id = generateId()
      areas[selectedArea.value].subs.push(createSubarea(id))
      // Persist will be called by parent component on subsequent interval
    }
  }

  const removeSubarea = (idx: number) => {
    if (selectedArea.value !== null && confirm('Remove this subarea?')) {
      areas[selectedArea.value].subs.splice(idx, 1)
      // Persist will be called by parent component on subsequent interval
    }
  }

  const toggleNote = (areaIdx: number, subIdx: number) => {
    const s = areas[areaIdx].subs[subIdx]
    s.noteVisible = !s.noteVisible
    // Persist will be called by parent component on subsequent interval
  }

  const clearNote = (subarea: Subarea) => {
    subarea.note = ''
    // Persist will be called by parent component on subsequent interval
  }

  const resetToday = () => {
    if (!confirm('Reset data for this date?')) return
    for (let i = 0; i < 4; i++) {
      areas[i].subs.splice(0, areas[i].subs.length)
    }
    for (let i = 0; i < 4; i++) {
      areas[i].subs.push(createSubarea(generateId()))
    }
    // Persist will be called by parent component on subsequent interval
  }

  const loadForDate = () => {} // Placeholder, logic moved to usePersistence

  return {
    labels,
    areas,
    selectedArea,
    selectedDate,
    overallScore,
    toggleArea,
    collapse,
    addSubarea,
    removeSubarea,
    toggleNote,
    clearNote,
    resetToday,
    loadForDate,
  }
}
