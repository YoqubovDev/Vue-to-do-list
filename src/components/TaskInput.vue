<template>
  <div class="input-section">
    <input 
      v-model="newTask.text" 
      placeholder="Enter task" 
      @keyup.enter="addTask" 
    >
    <select v-model="newTask.priority">
      <option value="low">
        Low
      </option>
      <option value="medium">
        Medium
      </option>
      <option value="high">
        High
      </option>
    </select>
    <select v-model="newTask.category">
      <option 
        v-for="category in categories" 
        :key="category" 
        :value="category"
      >
        {{ category }}
      </option>
    </select>
    <input
      v-model="newTask.deadline"
      type="date"
    >
    <button @click="addTask">
      ➕ Add Task
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-task'])
const toast = useToast()

const newTask = ref({
  text: '',
  priority: 'medium',
  deadline: '',
  category: props.categories[0] || 'Personal'
})

function addTask() {
  if (newTask.value.text.trim()) {
    // Emit the task to parent component
    emit('add-task', { ...newTask.value })
    
    // Reset form
    newTask.value.text = ''
    newTask.value.deadline = ''
    newTask.value.priority = 'medium'
    newTask.value.category = props.categories[0] || 'Personal'
    
    toast.success("Task added successfully! 🎉", { timeout: 2000 })
  }
}
</script>

<style scoped>
.input-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input, select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  flex: 1;
}

/* Light theme styles */
:deep(.light-theme) .input-section input,
:deep(.light-theme) .input-section select {
  border: 1px solid var(--light-input-border);
  background-color: var(--light-card-bg);
  color: var(--light-text);
}

:deep(.light-theme) .input-section button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--light-button-bg);
  color: white;
  border: none;
  cursor: pointer;
}

:deep(.light-theme) .input-section button:hover {
  background: var(--light-button-hover);
}

/* Dark theme styles */
:deep(.dark-theme) .input-section input,
:deep(.dark-theme) .input-section select {
  border: 1px solid var(--dark-input-border);
  background-color: var(--dark-card-bg);
  color: var(--dark-text);
}

:deep(.dark-theme) .input-section button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--dark-button-bg);
  color: white;
  border: none;
  cursor: pointer;
}

:deep(.dark-theme) .input-section button:hover {
  background: var(--dark-button-hover);
}
</style>
