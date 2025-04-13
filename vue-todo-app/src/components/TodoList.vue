<template>
  <div class="todo-list">
    <h2>Todo List</h2>
    
    <!-- Form to add new todos -->
    <div class="add-todo-form">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo" 
        placeholder="Add a new task"
        class="todo-input"
      />
      <button @click="addTodo" class="add-button">Add</button>
    </div>

    <!-- List of todos -->
    <ul class="todos">
      <li v-for="(todo, index) in todos" :key="index" class="todo-item">
        <div class="todo-content" :class="{ 'completed': todo.completed }">
          <input 
            type="checkbox" 
            v-model="todo.completed"
            class="todo-checkbox"
          />
          <span class="todo-text">{{ todo.text }}</span>
        </div>
        <button @click="removeTodo(index)" class="delete-button">Delete</button>
      </li>
    </ul>

    <!-- Summary -->
    <div class="todo-summary" v-if="todos.length > 0">
      <p>{{ completedCount }} completed out of {{ todos.length }} tasks</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  data() {
    return {
      newTodo: '',
      todos: []
    };
  },
  computed: {
    completedCount() {
      return this.todos.filter(todo => todo.completed).length;
    }
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({
          text: this.newTodo,
          completed: false
        });
        this.newTodo = '';
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.todo-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.add-todo-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.add-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #45a049;
}

.todos {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background-color: #f0f0f0;
}

.todo-content {
  display: flex;
  align-items: center;
}

.todo-checkbox {
  margin-right: 10px;
}

.todo-text {
  font-size: 16px;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}

.delete-button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.todo-summary {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>

