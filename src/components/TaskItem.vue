<template>
  <div
    :class="[
      'task-item', 
      task.priority, 
      'category-' + task.category.toLowerCase(), 
      { done: task.done },
      { 'due-today': isTaskDueToday },
      { 'due-tomorrow': isTaskDueTomorrow },
      { 'overdue': isTaskOverdue }
    ]"
  >
    <div class="drag-handle">
      ⋮⋮
    </div>
    <input 
      v-model="isDone" 
      type="checkbox" 
      @change="toggleTaskStatus" 
    >
    <div class="task-details">
      <span class="task-text">{{ task.text }}</span>
      <small class="task-meta">
        📅 {{ task.deadline || 'No deadline' }} | 🎯 {{ task.priority }} | 🏷️ {{ task.category }}
      </small>
    </div>
    <button @click="removeTask">
      ❌
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['toggle-status', 'remove-task']);

// Local ref for checkbox state
const isDone = ref(props.task.done);

// Watch for changes in task.done from parent
watch(() => props.task.done, (newValue) => {
  isDone.value = newValue;
});

// Due date computations
const isTaskDueToday = computed(() => {
  if (!props.task.deadline || props.task.done) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(props.task.deadline);
  dueDate.setHours(0, 0, 0, 0);
  
  
  return dueDate.getTime() === today.getTime();
});

const isTaskDueTomorrow = computed(() => {
  if (!props.task.deadline || props.task.done) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueDate = new Date(props.task.deadline);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate.getTime() === tomorrow.getTime();
});
const isTaskOverdue = computed(() => {
  if (!props.task.deadline || props.task.done) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(props.task.deadline);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate < today;
});

// Event handlers
function toggleTaskStatus() {
  emit('toggle-status', props.task, isDone.value);
}

function removeTask() {
  emit('remove-task', props.index);
}
</script>

<style>
/* Light Theme Styles */
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

/* Dark Theme Styles */
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

/* Hover effect */
.task-item:hover {
  transform: translateY(-2px);
}

/* Task completion styling */
.light-theme .task-item.done .task-text {
  text-decoration: line-through;
  color: var(--light-done-text);
}

.dark-theme .task-item.done .task-text {
  text-decoration: line-through;
  color: var(--dark-done-text);
}

/* Task details */
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

/* Priority indicators */
.task-item.low {
  border-left: 5px solid var(--light-priority-low);
}

.task-item.medium {
  border-left: 5px solid var(--light-priority-medium);
}

.task-item.high {
  border-left: 5px solid var(--light-priority-high);
}

/* Category Indicators */
.task-item.category-work::after {
  content: "W";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--light-cat-work);
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
  background-color: var(--light-cat-study);
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
  background-color: var(--light-cat-personal);
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
}

/* Due Date Styling */
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

/* Drag handle styling */
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

/* Animation keyframes are shared and will be defined in the parent component */
</style>

