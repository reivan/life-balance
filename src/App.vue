<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from './components/Input/BaseButton.vue'
import DateInput from './components/Input/DateInput.vue'
import QuadrantChart from './components/QuadrantChart/QuadrantChart.vue'
import QuadrantLegend from './components/QuadrantChart/QuadrantLegend.vue'
import AreaSliders from './components/Subarea/AreaSliders.vue'
import { useLifeBalanceData } from './composables/useLifeBalanceData'
import { usePersistence } from './composables/usePersistence'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  labels,
  areas,
  selectedArea,
  selectedDate,
  overallScore,
  toggleArea,
  collapse,
  resetToday,
  addSubarea,
  removeSubarea,
  toggleNote,
  clearNote,
} = useLifeBalanceData()

const { persist, loadForDate, exportJSON, importPrompt } = usePersistence(
  labels,
  areas,
  selectedDate,
)

onMounted(() => {
  loadForDate()
  setInterval(() => persist(), 2000)
})
</script>

<template>
  <div class="app-container">
    <header class="flex items-center justify-between mb-3">
      <h1 class="text-lg m-0">{{ t('dashboard.title') }}</h1>
      <DateInput v-model="selectedDate" @change="loadForDate" />
    </header>

    <div class="card">
      <div class="top">
        <QuadrantChart
          :labels="labels"
          :areas="areas"
          :selected-area="selectedArea"
          :overall-score="overallScore"
          @toggle-area="toggleArea"
          @collapse="collapse"
        />
        <QuadrantLegend
          :labels="labels"
          :areas="areas"
          @reset="resetToday"
          @toggle-area="toggleArea"
        />
      </div>

      <AreaSliders
        v-if="selectedArea !== null"
        :labels="labels"
        :areas="areas"
        :selected-area="selectedArea"
        @add-subarea="addSubarea"
        @collapse="collapse"
        @remove-subarea="removeSubarea"
        @toggle-note="toggleNote"
        @clear-note="clearNote"
        @persist="persist"
        @export-json="exportJSON"
        @import-prompt="importPrompt"
      />
      <div v-else class="sliders">
        <div class="empty">{{ t('dashboard.noAreaSelected') }}</div>
        <div class="mt-3 flex gap-2">
          <BaseButton :class="['btn-primary']" @click="persist()">{{
            t('buttons.saveSnapshot')
          }}</BaseButton>
          <BaseButton @click="exportJSON">{{ t('buttons.exportJSON') }}</BaseButton>
          <BaseButton @click="importPrompt">{{ t('buttons.importJSON') }}</BaseButton>
        </div>
      </div>
    </div>

    <footer class="mt-3 text-muted text-sm">{{ t('dashboard.footerTip') }}</footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 980px;
  margin: 20px auto;
  padding: 18px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

h1 {
  font-size: 18px;
  margin: 0;
}

.card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 30px rgba(2, 6, 23, 0.6);
  margin-bottom: 12px;
}
</style>
