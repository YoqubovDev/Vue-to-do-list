<template>
  <div
    class="todo-app"
    :class="isDarkMode ? 'dark-theme' : 'light-theme'"
  >
    <AppHeader 
      :is-dark-mode="isDarkMode"
      :sound-enabled="soundEnabled"
      @update:is-dark-mode="isDarkMode = $event"
      @update:sound-enabled="soundEnabled = $event"
      @play-ui-sound="playUiSound"
    />
    
    <TaskInput 
      :categories="categories"
      @add-task="handleAddTask"
    />
    
    <TaskFilters 
      v-model:searchQuery="searchQuery"
      v-model:filter="filter"
      v-model:categoryFilter="categoryFilter"
      :categories="categories"
    />
    
    <TaskList 
      v-model:tasks="tasks"
      :filter="filter"
      :category-filter="categoryFilter"
      :search-query="searchQuery"
      @save-tasks="saveTasks"
    />
  </div>
</template>

<script setup>
import { useTheme } from './composables/useTheme'
import { useSound } from './composables/useSound'
import { useTask } from './composables/useTask'
import AppHeader from './components/AppHeader.vue'
import TaskInput from './components/TaskInput.vue'
import TaskFilters from './components/TaskFilters.vue'
import TaskList from './components/TaskList.vue'

// Initialize theme state
const { isDarkMode } = useTheme()

// Initialize sound state
const { soundEnabled, playUiSound, playTaskCompletedSound } = useSound()

// Initialize task state
const { 
  tasks, 
  searchQuery,
  filter,
  categoryFilter,
  categories,
  addTask,
  saveTasks
} = useTask()

// Handler for adding tasks
function handleAddTask(taskData) {
  addTask(taskData)
  playTaskCompletedSound() // Play sound when task is added for user feedback
}
</script>

<style>
:root {
  /* Light Theme Variables */
  --light-bg: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  --light-text: #333;
  --light-card-bg: white;
  --light-input-border: #ccc;
  --light-shadow: rgba(0, 0, 0, 0.1);
  --light-priority-low: #81c784;
  --light-priority-medium: #ffb74d;
  --light-priority-high: #e57373;
  --light-button-bg: #4caf50;
  --light-button-hover: #45a049;
  --light-done-text: #888;
  --light-meta-text: #666;
  --light-handle-color: #ccc;
  --light-cat-work: #42a5f5;
  --light-cat-study: #9c27b0;
  --light-cat-personal: #26a69a;
  --light-due-today-bg: #fff8e1;
  --light-due-tomorrow-bg: #e8f5e9;
  --light-overdue-bg: #ffebee;
  
  /* Dark Theme Variables */
  --dark-bg: #1a2634;
  --dark-text: #e0e0e0;
  --dark-card-bg: #2c3a47;
  --dark-input-border: #444;
  --dark-shadow: rgba(0, 0, 0, 0.3);
  --dark-priority-low: #388e3c;
  --dark-priority-medium: #f57c00;
  --dark-priority-high: #d32f2f;
  --dark-button-bg: #2e7d32;
  --dark-button-hover: #1b5e20;
  --dark-done-text: #aaa;
  --dark-meta-text: #bbb;
  --dark-handle-color: #777;
  --dark-cat-work: #1976d2;
  --dark-cat-study: #7b1fa2;
  --dark-cat-personal: #00897b;
  --dark-due-tomorrow-bg: #0d3a63;
  --dark-overdue-bg: #5c1111;
  --dark-due-today-bg: #2c3800;
}

/* Apply transition to all elements for smooth theme switching */
* {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.todo-app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 0 20px var(--light-shadow);
}

.light-theme {
  background: var(--light-bg);
  color: var(--light-text);
  box-shadow: 0 0 20px var(--light-shadow);
}

.dark-theme {
  background: var(--dark-bg);
  color: var(--dark-text);
  box-shadow: 0 0 20px var(--dark-shadow);
}

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
.input-section,
.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.light-theme .input-section input,
.light-theme .input-section select,
.light-theme .controls input,
.light-theme .controls select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--light-input-border);
  background-color: var(--light-card-bg);
  color: var(--light-text);
  flex: 1;
}

.dark-theme .input-section input,
.dark-theme .input-section select,
.dark-theme .controls input,
.dark-theme .controls select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--dark-input-border);
  background-color: var(--dark-card-bg);
  color: var(--dark-text);
  flex: 1;
}
.light-theme .input-section button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--light-button-bg);
  color: white;
  border: none;
  cursor: pointer;
}

.light-theme .input-section button:hover {
  background: var(--light-button-hover);
}

.dark-theme .input-section button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--dark-button-bg);
  color: white;
  border: none;
  cursor: pointer;
}

.dark-theme .input-section button:hover {
  background: var(--dark-button-hover);
}
.task-list {
  padding: 0;
}

.light-theme .drag-handle {
  cursor: move;
  font-size: 1.2rem;
  color: var(--light-handle-color);
  margin-right: 5px;
  user-select: none;
}

.dark-theme .drag-handle {
  cursor: move;
  font-size: 1.2rem;
  color: var(--dark-handle-color);
  margin-right: 5px;
  user-select: none;
}
.light-theme .task-item {
  background: var(--light-card-bg);
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: 0.3s ease all;
  box-shadow: 0 2px 5px var(--light-shadow);
  position: relative;
}

.dark-theme .task-item {
  background: var(--dark-card-bg);
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: 0.3s ease all;
  box-shadow: 0 2px 5px var(--dark-shadow);
  position: relative;
}
.task-item:hover {
  transform: translateY(-2px);
}

.light-theme .task-item.done .task-text {
  text-decoration: line-through;
  color: var(--light-done-text);
}

.dark-theme .task-item.done .task-text {
  text-decoration: line-through;
  color: var(--dark-done-text);
}

.task-details {
  flex: 1;
}

.light-theme .task-meta {
  display: block;
  font-size: 0.75rem;
  color: var(--light-meta-text);
}

.dark-theme .task-meta {
  display: block;
  font-size: 0.75rem;
  color: var(--dark-meta-text);
}
.task-item.low {
  border-left: 5px solid #81c784;
}
.task-item.medium {
  border-left: 5px solid #ffb74d;
}
.task-item.high {
  border-left: 5px solid #e57373;
}

/* Category Indicators */
.task-item.category-work::after {
  content: "W";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #42a5f5;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
}

.task-item.category-study::after {
  content: "S";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #9c27b0;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
}

.task-item.category-personal::after {
  content: "P";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #26a69a;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
}

/* Animation and Ghost Classes for Dragging */
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #4a9eff;
}

.flip-list-move {
  transition: transform 0.5s;
}

/* Due Date Alert Styling */
.light-theme .task-item.due-today {
  background-color: var(--light-due-today-bg);
  animation: pulse-light 2s infinite;
  will-change: box-shadow;
}

.dark-theme .task-item.due-today {
  background-color: var(--dark-due-today-bg);
  animation: pulse-dark 2s infinite;
  will-change: box-shadow;
}

.light-theme .task-item.due-tomorrow {
  background-color: var(--light-due-tomorrow-bg);
}

.dark-theme .task-item.due-tomorrow {
  background-color: var(--dark-due-tomorrow-bg);
}

.light-theme .task-item.overdue {
  background-color: var(--light-overdue-bg);
  animation: shake 0.5s ease-in-out;
  will-change: transform;
}

.dark-theme .task-item.overdue {
  background-color: var(--dark-overdue-bg);
  animation: shake 0.5s ease-in-out;
  will-change: transform;
}

@keyframes pulse-light {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 167, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0);
  }
}

@keyframes pulse-dark {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 167, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

/* Performance optimization - reduce repaints */
.task-item {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
