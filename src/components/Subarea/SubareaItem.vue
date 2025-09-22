<script setup lang="ts">
import type { Subarea } from '../../types'
import { useCalculations } from '../../composables/useCalculations'
import { useI18n } from 'vue-i18n'
import BaseButton from '../Input/BaseButton.vue'

defineProps<{
  subarea: Subarea
}>()

const emit = defineEmits(['update:subarea', 'toggleNote', 'removeSubarea', 'clearNote'])

const { numFmt } = useCalculations() // No areas needed for numFmt
const { t } = useI18n()

const subareaModel = defineModel<Subarea>('subarea')
</script>

<template>
  <div class="sub">
    <div class="label">
      <input
        type="text"
        v-model="subareaModel!.label"
        @input="emit('update:subarea')"
        :placeholder="t('subarea.namePlaceholder')"
      />
      <div class="tiny muted">id: {{ subarea.id }}</div>
    </div>

    <div class="range-wrap">
      <input
        type="range"
        min="0"
        max="10"
        v-model.number="subareaModel!.value"
        @input="emit('update:subarea')"
      />
      <div style="width: 38px; text-align: center; font-weight: 600">
        {{ numFmt(subarea.value) }}
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-end">
      <BaseButton @click="emit('toggleNote')" :title="t('subarea.toggleNote')">📝</BaseButton>
      <BaseButton @click="emit('removeSubarea')" :title="t('subarea.removeSubarea')">🗑️</BaseButton>
    </div>

    <div v-if="subarea.noteVisible" class="note">
      <textarea
        v-model="subareaModel!.note"
        @input="emit('update:subarea')"
        rows="8"
        class="w-full border-none text-inherit resize-y"
        :placeholder="t('subarea.notePlaceholder')"
      ></textarea>
      <div class="tiny muted flex justify-between items-center">
        <div>{{ subarea.note ? subarea.note.length : 0 }} {{ t('subarea.chars') }}</div>
        <div>
          <BaseButton @click="emit('clearNote', subarea)">{{ t('buttons.clear') }}</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  background-color: var(--bg);
}

.sub {
  display: grid;
  grid-template-columns: 1fr 160px 38px;
  gap: 8px;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.01);
  margin-bottom: 8px;
}
.sub .label {
  display: flex;
  flex-direction: column;
}
.sub input[type='text'] {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.04);
  padding: 6px;
  border-radius: 6px;
  color: inherit;
}
.range-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
input[type='range'] {
  width: 120px;
}
.note {
  grid-column: 1/-1;
  padding: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  margin-top: 6px;
}
.w-full {
  width: 100%;
}
.text-inherit {
  color: inherit;
}
.resize-y {
  resize: vertical;
}
@media (max-width: 720px) {
  .sub {
    grid-template-columns: 1fr 140px 38px;
  }
}
</style>
