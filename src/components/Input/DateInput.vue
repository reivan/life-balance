<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const model = defineModel<string>()
</script>

<template>
  <div class="date-control">
    <div class="pill small">{{ t('dateInput.sessionDate') }}</div>
    <input type="date" v-model="model" />
  </div>
</template>

<style scoped>
.date-control {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
