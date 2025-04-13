<template>
  <div id="app">
    <header>
      <h1>Vue Todo App</h1>
    </header>
    <main>
      <TodoList />
    </main>
    <footer>
      <p>&copy; 2025 Vue Todo App</p>
    </footer>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue';

export default {
  name: 'App',
  components: {
    TodoList
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

header {
  background-color: #42b983;
  color: white;
  padding: 1rem;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
}

main {
  flex: 1;
  padding: 0 1rem;
}

footer {
  padding: 1rem;
  background-color: #f0f0f0;
  margin-top: 2rem;
}
</style>
