<template>
  <li class="task-item">
    <div class="task-content">
      <input type="checkbox" :checked="task.completed" @change="$emit('toggle-complete', task.id, !task.completed)" />

      <input v-if="isEditing" type="text" v-model="editableTitle" class="edit-input" @keyup.enter="saveEdit" />

      <span v-else :class="{ completed: task.completed }" @click="startEdit" title="Clique para editar"
        class="task-title-text">
        {{ task.title }}
        <small>(ID: {{ task.id }})</small>
        <span v-if="userRole === 'admin'" class="admin-tag">(Admin)</span>
      </span>
    </div>

    <div class="task-actions">
      <button v-if="isEditing" @click="saveEdit" class="save-btn">Salvar</button>

      <button v-if="userRole === 'admin'" @click="$emit('delete-task', task.id)" class="delete-btn">
        Excluir
      </button>
    </div>
  </li>
</template>

<script src="./TaskItem.js"></script>
<style lang="scss" src="./TaskItem.scss" scoped></style>
