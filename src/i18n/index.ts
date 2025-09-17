import { createI18n } from 'vue-i18n'
import en from './en'
// import ru from './ru'; // Uncomment and import Russian translations if needed

export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    // ru, // Add Russian messages here
  },
})
