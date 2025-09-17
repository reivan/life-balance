<script setup lang="ts">
import { computed } from 'vue'
import { useCalculations } from '../../composables/useCalculations'
import type { Area, Labels } from '../../types'

const props = defineProps<{
  labels: Labels
  areas: Record<number, Area>
  selectedArea: number | null
  overallScore: number
}>()

const emit = defineEmits(['toggleArea', 'collapse'])

const { avgFor, formatScore } = useCalculations(props.areas)

// SVG helpers: create a sector path from angles
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180.0
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
function sectorPath(startAngle: number, endAngle: number, r: number) {
  // convert so 0 at right, clockwise; our svg center at 0,0
  const sa = startAngle
  const ea = endAngle
  const p1 = polarToCartesian(0, 0, r, sa)
  const p2 = polarToCartesian(0, 0, r, ea)
  const largeArc = ea - sa <= 180 ? 0 : 1
  return `M 0 0 L ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)} Z`
}

// fill based on average — we use gradients defined in svg and apply opacity
function quadFill(i: number) {
  const id = ['url(#g0)', 'url(#g1)', 'url(#g2)', 'url(#g3)'][i]
  return id
}

const quadrantPositions = computed(() => [
  { transform: 'translate(0,-60)', idx: 0 },
  { transform: 'translate(60,0)', idx: 1 },
  { transform: 'translate(0,60)', idx: 2 },
  { transform: 'translate(-60,0)', idx: 3 },
])
</script>

<template>
  <div class="circle-wrap">
    <svg viewBox="-110 -110 220 220" @keydown.esc="emit('collapse')" tabindex="0">
      <defs>
        <linearGradient id="g0" x1="0" x2="1">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.2" />
        </linearGradient>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stop-color="#34d399" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#34d399" stop-opacity="0.15" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.15" />
        </linearGradient>
        <linearGradient id="g3" x1="0" x2="1">
          <stop offset="0%" stop-color="#f87171" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#f87171" stop-opacity="0.12" />
        </linearGradient>
      </defs>

      <circle
        r="100"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.03)"
        stroke-width="1"
      />

      <g style="cursor: pointer">
        <path
          :d="sectorPath(-90, 0, 100)"
          :fill="quadFill(0)"
          @click="emit('toggleArea', 0)"
          :stroke="selectedArea === 0 ? 'white' : 'none'"
          stroke-width="1.5"
        />
        <path
          :d="sectorPath(0, 90, 100)"
          :fill="quadFill(1)"
          @click="emit('toggleArea', 1)"
          :stroke="selectedArea === 1 ? 'white' : 'none'"
          stroke-width="1.5"
        />
        <path
          :d="sectorPath(90, 180, 100)"
          :fill="quadFill(2)"
          @click="emit('toggleArea', 2)"
          :stroke="selectedArea === 2 ? 'white' : 'none'"
          stroke-width="1.5"
        />
        <path
          :d="sectorPath(180, 270, 100)"
          :fill="quadFill(3)"
          @click="emit('toggleArea', 3)"
          :stroke="selectedArea === 3 ? 'white' : 'none'"
          stroke-width="1.5"
        />
      </g>

      <g font-family="sans-serif" fill="#e6eef8" font-size="12" text-anchor="middle">
        <g v-for="pos in quadrantPositions" :key="pos.idx" :transform="pos.transform">
          <text y="0" :class="{ highlight: selectedArea === pos.idx }">{{ labels[pos.idx] }}</text>
          <text y="14" font-size="16" class="small">{{ formatScore(avgFor(pos.idx)) }}</text>
        </g>

        <g transform="translate(0,0)">
          <circle r="36" fill="rgba(255,255,255,0.03)" />
          <text y="-4" font-size="13" class="muted">Overall</text>
          <text y="14" font-size="20" class="highlight">{{ formatScore(overallScore) }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
/* Add any specific styles for the QuadrantChart here */
</style>
