<template>
  <div :class="{completed: todo.completed}" @click="toggleTodo">
    <input style="color: black" type="checkbox" v-model="todo.completed">
    {{todo.text}}
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import type {TodoType} from "@/types/todo";

const props = defineProps<{todo: TodoType}>()
const emit = defineEmits(['toggle'])

const todo = ref(props.todo)

function toggleTodo() {
  todo.value.completed = !todo.value.completed
  emit("toggle", todo.value)
}

</script>

<style lang="scss" scoped>
.completed{
  color: black;
  text-decoration: line-through;
}
</style>