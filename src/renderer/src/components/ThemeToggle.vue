<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :title="isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'"
  >
    <span v-if="isDark" class="icon">☀️</span>
    <span v-else class="icon">🌙</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'ThemeToggle',
  setup() {
    const isDark = ref(false);

    const applyTheme = (dark: boolean) => {
      isDark.value = dark;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    };

    const toggleTheme = () => {
      applyTheme(!isDark.value);
    };

    const loadTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        applyTheme(savedTheme === 'dark');
      } else {
        applyTheme(systemPrefersDark);
      }
    };

    // Слушаем изменения системной темы
    watch(
      () => window.matchMedia('(prefers-color-scheme: dark)').matches,
      (systemPrefersDark) => {
        if (!localStorage.getItem('theme')) {
          applyTheme(systemPrefersDark);
        }
      }
    );

    onMounted(() => {
      loadTheme();
    });

    return {
      isDark,
      toggleTheme,
    };
  },
});
</script>

<style scoped>
.theme-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10%;
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: var(--color-button-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--color-button-hover);
  transform: translateY(-50%) scale(1.1);
}

.icon {
  pointer-events: none;
}
</style>
