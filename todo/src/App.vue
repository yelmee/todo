<template>
  <div v-if="isLoading">Loading...</div>
  <TodoList :todos="todos" @update-todo="toggleTodo"/>
  <div>
    <div>
      <input style="color: black" type="text" v-model="newTodoText">
      <button  style="color: black" @click="addTodo">Add Todo</button>
    </div>
    <div>
      <button  style="color: black" @click="clearCompleted">Clear Complete</button>
    </div>
    <div>
      <input  style="color: black" type="text" v-model="searchText">
      <button  style="color: black" @click="searchTodo(searchText)">Search</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import type {TodoType} from "@/types/todo";
import axios from "axios";
import TodoList from "@/components/TodoList.vue";

const todos = ref<TodoType[]>([])

const newTodoText = ref("")

const searchText = ref("")

const isLoading = ref(false)

function debounce(func: Function, wait: number) {
  let timeout: number;
  return function (...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)

    timeout = setTimeout(later, wait)
  };
}

const addTodo = async () => {
  if (newTodoText.value.trim()) {
    try {
      const response = await axios.post("https://api.example.com/todos", {
        text: newTodoText.value,
        completed: false,
      })

      todos.value.push(response.data)
      newTodoText.value = ""
    } catch (err) {
      console.error("Failed to add todos", err)
    }
  }
}
  const clearCompleted = async () => {
    const completedTodos = todos.value.filter((todo) => todo.completed);

    for (const todo of completedTodos) {
      try {
        await axios.delete(`https://api.example.com/todos/${todo.id}`);
        todos.value = todos.value.filter((t) => t.id !== todo.id)
      } catch (err) {
        console.error("Failed to add todos", err)
      }
    }
  }

  const toggleTodo = async (todoToUpdate: TodoType) => {
    try {
      const response = await axios.put(
          `https://api.example.com/todos/${todoToUpdate.id}`
          , {
            ...todoToUpdate,
            completed: !todoToUpdate.completed
          })
      const updatedTodo = response.data
      const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    } catch (err) {
      console.error("Failed to toggle todo", err)
    }
  }

const searchTodo = async (query: string) => {
  try {
    isLoading.value = true
    const response = await axios.get(
        `https://api.example.com/todos?query=${query}`
    );
    todos.value = response.data
  } catch (err){
    console.error("Failed to search todo", err)
  }finally {
    isLoading.value = false
  }
}

const debouncedSearch = debounce(() => searchTodo(searchText.value), 500)

watch(searchText, () => {
  debouncedSearch()
})

onMounted(async () => {
  try {
    const response = await axios.get('https://api.example.com/todos')
    todos.value = response.data
  } catch (err) {
    console.error("Failed to fetch todos", err)
  }
})
</script>

<style lang="scss" scoped>
 body {
   background-color: white;
 }
</style>