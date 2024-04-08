<template>
  <Todo
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="handleToggle"
  />
</template>

<script lang="ts" setup>
import type {TodoType} from "@/types/todo";
import Todo from "@/components/Todo.vue";
defineProps<{todos: TodoType[]}>();
const emit = defineEmits(["updateTodo"])

const handleToggle = (updatedTodo: TodoType) => {
  emit('updateTodo', updatedTodo)
}
</script>

<style lang="scss" scoped>

</style>