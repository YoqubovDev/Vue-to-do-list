<template>
  <div class="app-header">
    <h1>📋 My Advanced To-Do List</h1>
    <div class="header-controls">
      <button
        class="sound-toggle"
        title="Toggle sound"
        @click="toggleSound"
      >
        {{ soundEnabled ? '🔊' : '🔇' }}
      </button>
      <button
        class="theme-toggle"
        title="Toggle theme"
        @click="toggleTheme"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  },
  soundEnabled: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:isDarkMode', 'update:soundEnabled', 'playUiSound']);

const toast = useToast();

function toggleTheme() {
  emit('update:isDarkMode', !props.isDarkMode);
  toast.info(`Switched to ${!props.isDarkMode ? 'dark' : 'light'} mode`, { timeout: 2000 });
}

function toggleSound() {
  emit('update:soundEnabled', !props.soundEnabled);
  toast.info(`Sound notifications ${!props.soundEnabled ? 'enabled' : 'disabled'}`, { timeout: 2000 });
  
  // Play a test sound when enabling
  if (!props.soundEnabled) {
    emit('playUiSound');
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-controls {
  display: flex;
  gap: 0.5rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.theme-toggle, .sound-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: transform 0.3s;
}

.theme-toggle:hover, .sound-toggle:hover {
  transform: rotate(30deg);
}
</style>

