import { computed } from 'vue'
import type { Area } from '../types'

export function useCalculations(areas?: Record<number, Area>) {
  function avgFor(i: number): number {
    if (!areas || !areas[i] || !areas[i].subs) return 0
    const list = areas[i].subs
    if (list.length === 0) return 0
    const sum = list.reduce((a, b) => a + (Number(b.value) || 0), 0)
    return sum / list.length
  }

  const overallScore = computed(() => {
    if (!areas) return 0
    const vals = [0, 1, 2, 3].map((i) => avgFor(i))
    const nonzero = vals.filter((v) => !isNaN(v) && v !== 0) // Exclude 0 from average if no subs
    const sum = nonzero.reduce((a, b) => a + b, 0)
    return nonzero.length ? sum / nonzero.length : 0
  })

  function formatScore(v: number): string {
    return (Math.round(v * 10) / 10).toFixed(1)
  }

  function numFmt(v: number): string {
    return (Math.round(v * 10) / 10).toFixed(1)
  }

  function subCount(i: number): number {
    if (!areas || !areas[i] || !areas[i].subs) return 0
    return areas[i].subs.length
  }

  function areaColor(i: number): string {
    const palette = ['#60a5fa', '#34d399', '#f59e0b', '#f87171']
    return palette[i]
  }
  return { avgFor, overallScore, formatScore, numFmt, subCount, areaColor }
}
