<template>
  <div class="task-list">
    <draggable 
      v-model="taskList" 
      item-key="id"
      ghost-class="ghost"
      handle=".drag-handle"
      animation="200"
      @end="onDragEnd"
    >
      <template #item="{element: task, index}">
        <TaskItem 
          :task="task" 
          :index="index"
          @toggle-status="onTaskStatusChange"
          @remove-task="onTaskRemove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import draggable from 'vuedraggable';
import TaskItem from './TaskItem.vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  filter: {
    type: String,
    required: true
  },
  categoryFilter: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:tasks', 'save-tasks']);

// Computed property for filtered tasks with two-way binding for draggable
const taskList = computed({
  get() {
    return filteredTasks.value;
  },
  set(updatedList) {
    // When list is reordered, update the original tasks array
    emit('update:tasks', mergeTaskLists(updatedList));
    emit('save-tasks');
  }
});

// Computed property for filtered tasks based on filters
const filteredTasks = computed(() => {
  return props.tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(props.searchQuery.toLowerCase());
    const matchesFilter =
        props.filter === 'all' ||
        (props.filter === 'completed' && task.done) ||
        (props.filter === 'active' && !task.done);
    const matchesCategory = props.categoryFilter === 'all' || task.category === props.categoryFilter;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });
});

// Helper function to merge the filtered tasks back into the full task list
function mergeTaskLists(updatedFilteredList) {
  // Create a mapping of task IDs to their new positions
  const updatedIds = updatedFilteredList.map(task => task.id);
  
  // First, extract all tasks that are in the filtered view into a separate array
  const tasksInFilteredView = props.tasks.filter(task => updatedIds.includes(task.id));
  
  // Then sort that array based on the new ordering in updatedFilteredList
  tasksInFilteredView.sort((a, b) => {
    return updatedIds.indexOf(a.id) - updatedIds.indexOf(b.id);
  });
  
  // Now rebuild the tasks array, preserving items not in the filtered view
  const newTasks = [...props.tasks];
  
  // For each task in our original array
  for (let i = 0; i < newTasks.length; i++) {
    // If it's in our filtered view, we'll process it
    const filteredIndex = tasksInFilteredView.findIndex(t => t.id === newTasks[i].id);
    
    if (filteredIndex !== -1) {
      // Replace it with the correctly ordered task from the filtered view
      newTasks[i] = tasksInFilteredView[filteredIndex];
      // Remove the task from our filtered view copy to avoid duplicates
      tasksInFilteredView.splice(filteredIndex, 1);
    }
  }
  
  return newTasks;
}

// Event handlers
function onDragEnd() {
  emit('save-tasks');
}

function onTaskStatusChange(task, isDone) {
  const taskIndex = props.tasks.findIndex(t => t.id === task.id);
  if (taskIndex !== -1) {
    const updatedTask = { ...props.tasks[taskIndex], done: isDone };
    const updatedTasks = [...props.tasks];
    updatedTasks[taskIndex] = updatedTask;
    
    emit('update:tasks', updatedTasks);
    emit('save-tasks');
  }
}

function onTaskRemove(index) {
  const taskId = filteredTasks.value[index].id;
  const taskIndex = props.tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex !== -1) {
    const updatedTasks = [...props.tasks];
    updatedTasks.splice(taskIndex, 1);
    
    emit('update:tasks', updatedTasks);
    emit('save-tasks');
  }
}

// Watch for filter changes to ensure the list updates
watch([() => props.filter, () => props.searchQuery, () => props.categoryFilter], () => {
  // This is needed for reactivity when filters change
});
</script>

<style scoped>
.task-list {
  padding: 0;
}

/* Ghost class for dragging */
:deep(.ghost) {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #4a9eff;
}

/* Animation for list items */
:deep(.flip-list-move) {
  transition: transform 0.5s;
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

