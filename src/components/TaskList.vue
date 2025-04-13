<template>
  <div class="task-list">
    <div 
      ref="listRef"
      class="task-items-container"
    >
      <TaskItem
        v-for="(task, index) in filteredValidTasks"
        :key="task?.id || index"
        :task="task"
        :index="index"
        @toggle-status="onTaskStatusChange"
        @remove-task="onTaskRemove"
      />
    </div>
  </div>
</template>

<script setup>
// Update imports to ensure proper order and remove unused ones
import { 
  computed, 
  watch, 
  toRefs, 
  ref, 
  nextTick, 
  onMounted, 
  onUnmounted 
} from 'vue';
import Sortable from 'sortablejs';
import TaskItem from './TaskItem.vue';

// Update the emits definition to be more explicit
const emit = defineEmits({
  'update:tasks': (tasks) => Array.isArray(tasks),
  'save-tasks': () => true
});

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  },
  filter: {
    type: String,
    required: true,
    default: 'all'
  },
  categoryFilter: {
    type: String,
    required: true,
    default: 'all'
  },
  searchQuery: {
    type: String,
    required: true,
    default: ''
  }
});

// Initialize refs and state
const { tasks, filter, categoryFilter, searchQuery } = toRefs(props);
const listRef = ref(null);
const currentTasks = ref([]);
const isInitialized = ref(false);
let sortableInstance = null;

// Simplified initialization function
function initializeSortable() {
  if (!listRef.value || !isInitialized.value) return;
  
  if (sortableInstance) {
    sortableInstance.destroy();
  }

  sortableInstance = new Sortable(listRef.value, {
    animation: 150,
    handle: '.drag-handle',
    ghostClass: 'ghost',
    dragClass: 'sortable-drag',
    onStart: (evt) => {
      evt.item.style.opacity = '0.5';
    },
    onEnd: (evt) => {
      evt.item.style.opacity = '1';
      const { oldIndex, newIndex } = evt;
      if (oldIndex !== newIndex && oldIndex !== undefined && newIndex !== undefined) {
        const updatedList = [...currentTasks.value];
        const movedItem = updatedList.splice(oldIndex, 1)[0];
        updatedList.splice(newIndex, 0, movedItem);
        
        
        const newTasks = mergeTaskLists(updatedList);
        if (Array.isArray(newTasks)) {
          emit('update:tasks', newTasks);
          emit('save-tasks');
        }
      }
    }
  });
}
// Simplified filteredTasks computed
const filteredTasks = computed(() => {
  if (!Array.isArray(tasks.value)) return [];
  
  return tasks.value.filter((task) => {
    if (!task || typeof task !== 'object' || !task.id) return false;
    
    const matchesSearch = task.text?.toLowerCase().includes((searchQuery.value || '').toLowerCase());
    const matchesFilter =
        filter.value === 'all' ||
        (filter.value === 'completed' && task.done) ||
        (filter.value === 'active' && !task.done);
    const matchesCategory = categoryFilter.value === 'all' || task.category === categoryFilter.value;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });
});

// Create a computed property that filters out invalid tasks
const filteredValidTasks = computed(() => {
  return currentTasks.value.filter(task => task && task.id);
});

// Watch filteredTasks to update currentTasks
watch(filteredTasks, (newTasks) => {
  if (!isInitialized.value) return;
  
  nextTick(() => {
    currentTasks.value = newTasks;
    // Re-initialize sortable after tasks update
    initializeSortable();
  });
}, { immediate: false }); // Remove immediate flag to prevent premature updates

// Add a watch for the tasks prop
watch(tasks, () => {
  if (!isInitialized.value) return;
  
  nextTick(() => {
    currentTasks.value = filteredTasks.value;
    initializeSortable();
  });
});
// Helper function to merge the filtered tasks back into the full task list
function mergeTaskLists(updatedList) {
  if (!Array.isArray(tasks.value) || !Array.isArray(updatedList)) {
    return tasks.value || [];
  }

  // Create a map of existing tasks by ID for quick lookup
  const taskMap = new Map(tasks.value.map(task => [task.id, task]));
  
  // Create a new array with the updated order
  const newTasks = [...tasks.value];
  
  // Update the positions based on the updated list
  updatedList.forEach((task, index) => {
    if (task && task.id) {
      const existingTask = taskMap.get(task.id);
      if (existingTask) {
        // Find the current position of this task
        const currentIndex = newTasks.findIndex(t => t.id === task.id);
        if (currentIndex !== -1 && currentIndex !== index) {
          // Move the task to its new position
          newTasks.splice(currentIndex, 1);
          newTasks.splice(index, 0, existingTask);
        }
      }
    }
  });
  
  return newTasks;
}

// Event handlers

function onTaskStatusChange(task, isDone) {
  if (!task?.id || !Array.isArray(tasks.value)) return;
  
  const taskIndex = tasks.value.findIndex(t => t?.id === task.id);
  if (taskIndex !== -1) {
    const updatedTask = { ...tasks.value[taskIndex], done: isDone };
    const updatedTasks = [...tasks.value];
    updatedTasks[taskIndex] = updatedTask;
    
    emit('update:tasks', updatedTasks);
    emit('save-tasks');
  }
}

function onTaskRemove(index) {
  if (!Array.isArray(filteredTasks.value) || !filteredTasks.value[index]?.id) return;
  
  const taskId = filteredTasks.value[index].id;
  if (!taskId || !Array.isArray(tasks.value)) return;
  
  const taskIndex = tasks.value.findIndex(t => t?.id === taskId);
  
  if (taskIndex !== -1) {
    const updatedTasks = [...tasks.value];
    updatedTasks.splice(taskIndex, 1);
    
    emit('update:tasks', updatedTasks);
    emit('save-tasks');
  }
}

// Simplified watch for filters
watch([filter, searchQuery, categoryFilter], () => {
  if (isInitialized.value) {
    nextTick(initializeSortable);
  }
});

// Watch for changes in the list reference to initialize sortable
watch(listRef, (newVal) => {
  if (newVal && isInitialized.value) {
    nextTick(initializeSortable);
  }
});

// Update onMounted hook to ensure proper initialization order
onMounted(() => {
  nextTick()
    .then(() => {
      // Set initial tasks
      currentTasks.value = filteredTasks.value;
      // Mark as initialized
      isInitialized.value = true;
      // Initialize sortable after everything is ready
      return nextTick();
    })
    .then(() => {
      initializeSortable();
    });
});

// Cleanup on unmount
onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
});
</script>

<style scoped>
.task-list {
  padding: 0;
}

.task-items-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 10px; /* Ensure container is visible even when empty */
}

/* Improve animation timing */
.flip-list-move {
  transition: transform 0.3s ease; /* Slightly faster transition */
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.3s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.sortable-drag {
  opacity: 0;
}

/* Ghost class for dragging */
:deep(.ghost) {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #4a9eff;
}

/* Define animation keyframes that TaskItem uses */
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
</style>

