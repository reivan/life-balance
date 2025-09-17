<script setup lang="ts">
import { computed } from 'vue'
import { useCalculations } from '../../composables/useCalculations'
import type { Area, Labels } from '../../types'
import SubareaItem from './SubareaItem.vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../Input/BaseButton.vue'

const props = defineProps<{
  labels: Labels
  areas: Record<number, Area>
  selectedArea: number
}>()

const emit = defineEmits([
  'addSubarea',
  'collapse',
  'removeSubarea',
  'toggleNote',
  'clearNote',
  'persist',
  'exportJson',
  'importPrompt',
])

const { t } = useI18n()
const { avgFor, formatScore } = useCalculations(props.areas)

const currentArea = computed(() => props.areas[props.selectedArea])
</script>

<template>
  <div class="sliders">
    <div class="flex justify-between items-center mb-2">
      <div>
        <div class="small muted">{{ t('sliders.editing') }}</div>
        <div class="highlight text-lg">{{ labels[selectedArea] }}</div>
      </div>
      <div class="flex gap-2 items-center">
        <BaseButton @click="emit('addSubarea')">{{ t('buttons.addSubarea') }}</BaseButton>
        <BaseButton @click="emit('collapse')">{{ t('buttons.close') }}</BaseButton>
      </div>
    </div>

    <div class="controls">
      <div class="tiny muted">{{ t('sliders.quickActions') }}</div>
      <div class="flex-1"></div>
      <div class="tiny muted">
        {{ t('sliders.aggregate') }}:
        <span class="highlight">{{ formatScore(avgFor(selectedArea)) }}</span>
      </div>
    </div>

    <SubareaItem
      v-for="(s, idx) in currentArea.subs"
      :key="s.id"
      :subarea="s"
      @update:subarea="emit('persist')"
      @toggle-note="emit('toggleNote', selectedArea, idx)"
      @remove-subarea="emit('removeSubarea', idx)"
      @clear-note="emit('clearNote', s)"
    />

    <div class="mt-3 flex gap-2">
      <BaseButton :class="['btn-primary']" @click="emit('persist')">{{
        t('buttons.saveSnapshot')
      }}</BaseButton>
      <BaseButton @click="emit('exportJson')">{{ t('buttons.exportJSON') }}</BaseButton>
      <BaseButton @click="emit('importPrompt')">{{ t('buttons.importJSON') }}</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}
</style>
