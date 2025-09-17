<script setup lang="ts">
import { useCalculations } from '../../composables/useCalculations'
import type { Area, Labels } from '../../types'
import { useI18n } from 'vue-i18n'
import BaseButton from '../Input/BaseButton.vue'

const props = defineProps<{
  labels: Labels
  areas: Record<number, Area>
}>()

const emit = defineEmits(['reset', 'toggleArea'])

const { t } = useI18n()
const { avgFor, formatScore, subCount, areaColor } = useCalculations(props.areas)
</script>

<template>
  <div class="legend">
    <div class="flex justify-between items-center mb-2">
      <div>
        <div class="small muted">{{ t('quadrantLegend.tapQuadrantTip') }}</div>
      </div>
      <div>
        <BaseButton @click="emit('reset')" :title="t('quadrantLegend.resetTodayData')">
          {{ t('buttons.reset') }}
        </BaseButton>
      </div>
    </div>

    <div v-for="(l, i) in labels" :key="i" class="area card" @click="emit('toggleArea', i)">
      <div class="left">
        <div class="swatch" :style="{ background: areaColor(i) }"></div>
        <div>
          <div class="highlight">{{ l }}</div>
          <div class="small muted">
            {{ subCount(i) }} {{ t('quadrantLegend.subareas') }} • {{ t('quadrantLegend.avg') }}
            {{ formatScore(avgFor(i)) }}
          </div>
        </div>
      </div>
      <div class="highlight">{{ formatScore(avgFor(i)) }}</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: transparent;
}
.area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 6px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
