<template>
  <div class="controls">
    <input 
      v-model="searchText" 
      placeholder="🔍 Search tasks..." 
      @input="updateSearchQuery"
    >
    <select
      v-model="statusFilter"
      @change="updateStatusFilter"
    >
      <option value="all">
        All
      </option>
      <option value="active">
        Active
      </option>
      <option value="completed">
        Completed
      </option>
    </select>
    <select
      v-model="selectedCategory"
      @change="updateCategoryFilter"
    >
      <option value="all">
        All Categories
      </option>
      <option 
        v-for="category in categories" 
        :key="category" 
        :value="category"
      >
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  filter: {
    type: String,
    default: 'all'
  },
  categoryFilter: {
    type: String,
    default: 'all'
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:filter', 'update:categoryFilter', 'update:searchQuery']);

// Local refs that sync with props
const searchText = ref(props.searchQuery);
const statusFilter = ref(props.filter);
const selectedCategory = ref(props.categoryFilter);

// Watch for prop changes to update local refs
watch(() => props.searchQuery, (newValue) => {
  searchText.value = newValue;
});

watch(() => props.filter, (newValue) => {
  statusFilter.value = newValue;
});

watch(() => props.categoryFilter, (newValue) => {
  selectedCategory.value = newValue;
});

// Event handlers that emit changes to parent
function updateSearchQuery() {
  emit('update:searchQuery', searchText.value);
}

function updateStatusFilter() {
  emit('update:filter', statusFilter.value);
}

function updateCategoryFilter() {
  emit('update:categoryFilter', selectedCategory.value);
}
</script>

<style scoped>
.controls {
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
:deep(.light-theme) .controls input,
:deep(.light-theme) .controls select {
  border: 1px solid var(--light-input-border);
  background-color: var(--light-card-bg);
  color: var(--light-text);
}

/* Dark theme styles */
:deep(.dark-theme) .controls input,
:deep(.dark-theme) .controls select {
  border: 1px solid var(--dark-input-border);
  background-color: var(--dark-card-bg);
  color: var(--dark-text);
}
</style>
