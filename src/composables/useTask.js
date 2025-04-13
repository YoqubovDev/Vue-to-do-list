import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useSound } from './useSound'

export function useTask() {
  const tasks = ref([])
  const searchQuery = ref('')
  const filter = ref('all')
  const categoryFilter = ref('all')
  const dueDateCheckInterval = ref(null)
  const notifiedTaskIds = ref(new Set())
  const categories = ["Work", "Study", "Personal"]
  
  const toast = useToast()
  const { 
    playDueTodaySound, 
    playOverdueSound
  } = useSound()

  // Task operations
  function addTask(task) {
    // Generate a unique ID for the task
    const id = Date.now().toString()
    tasks.value.push({ ...task, done: false, id })
    saveTasks()
  }

  function removeTask(index) {
    tasks.value.splice(index, 1)
    saveTasks()
  }

  function updateTaskStatus(task, isDone) {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index].done = isDone
      saveTasks()
    }
  }
  
  function updateTasks(newTasks) {
    tasks.value = newTasks
  }

  // Local storage operations
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  function loadTasks() {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      tasks.value = JSON.parse(saved)
      // Ensure all tasks have IDs
      tasks.value.forEach(task => {
        if (!task.id) {
          task.id = Date.now().toString() + Math.random().toString().slice(2)
        }
      })
    }
    
    // After loading tasks, check for due dates
    setTimeout(() => {
      checkDueDates()
    }, 1000) // Short delay to allow UI to render first
  }

  // Due date checking
  function checkDueDates() {
    const overdueTasks = tasks.value.filter(task => isTaskOverdue(task) && !task.done)
    const todayTasks = tasks.value.filter(task => isTaskDueToday(task) && !task.done)
    const tomorrowTasks = tasks.value.filter(task => isTaskDueTomorrow(task) && !task.done)
    
    // Check for new overdue tasks and play sound for them
    const newOverdueTasks = overdueTasks.filter(task => !notifiedTaskIds.value.has(`overdue-${task.id}`))
    if (newOverdueTasks.length > 0) {
      newOverdueTasks.forEach(task => {
        notifiedTaskIds.value.add(`overdue-${task.id}`)
      })
      
      if (overdueTasks.length > 0) {
        toast.error(`You have ${overdueTasks.length} overdue ${overdueTasks.length === 1 ? 'task' : 'tasks'}! ⚠️`, { timeout: 5000 })
        playOverdueSound()
      }
    }
    
    // Check for new tasks due today and play sound for them
    const newTodayTasks = todayTasks.filter(task => !notifiedTaskIds.value.has(`today-${task.id}`))
    if (newTodayTasks.length > 0) {
      newTodayTasks.forEach(task => {
        notifiedTaskIds.value.add(`today-${task.id}`)
      })
      
      if (todayTasks.length > 0) {
        toast.warning(`You have ${todayTasks.length} ${todayTasks.length === 1 ? 'task' : 'tasks'} due today! ⏰`, { timeout: 4000 })
        playDueTodaySound()
      }
    }
    
    if (tomorrowTasks.length > 0) {
      toast.info(`You have ${tomorrowTasks.length} ${tomorrowTasks.length === 1 ? 'task' : 'tasks'} due tomorrow! 📅`, { timeout: 3000 })
    }
  }

  // Date utility functions
  function isTaskDueToday(task) {
    if (!task.deadline || task.done) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const dueDate = new Date(task.deadline)
    dueDate.setHours(0, 0, 0, 0)
    
    return dueDate.getTime() === today.getTime()
  }

  function isTaskDueTomorrow(task) {
    if (!task.deadline || task.done) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dueDate = new Date(task.deadline)
    dueDate.setHours(0, 0, 0, 0)
    
    return dueDate.getTime() === tomorrow.getTime()
  }

  function isTaskOverdue(task) {
    if (!task.deadline || task.done) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const dueDate = new Date(task.deadline)
    dueDate.setHours(0, 0, 0, 0)
    
    return dueDate < today
  }

  // Setup due date checking interval
  function startDueDateChecks() {
    // Immediate check when loading
    checkDueDates()
    
    // Then check every 3 hours (in milliseconds)
    dueDateCheckInterval.value = setInterval(() => {
      checkDueDates()
    }, 3 * 60 * 60 * 1000)
  }

  onMounted(() => {
    loadTasks()
    startDueDateChecks()
  })

  onUnmounted(() => {
    if (dueDateCheckInterval.value) {
      clearInterval(dueDateCheckInterval.value)
    }
  })

  return {
    tasks,
    searchQuery,
    filter,
    categoryFilter,
    categories,
    addTask,
    removeTask,
    updateTaskStatus,
    updateTasks,
    saveTasks
  }
}

