<template>
  <li class="task-card" :class="{ 'is-completed': task.completed }" @click="$emit('select-task', task.id)">
    
    <div class="task-left">
      <label class="custom-checkbox" @click.stop>
        <input type="checkbox" :checked="task.completed" @change="$emit('toggle-complete', task.id, !task.completed)" />
        <span class="checkmark"></span>
      </label>

      <div class="task-info">
        <input v-if="isEditing" type="text" v-model="editableTitle" class="edit-input" @keyup.enter="saveEdit" @click.stop />
        <span v-else class="task-title">{{ task.title }}</span>
        
        <div class="task-meta" v-if="!isEditing">
            <span class="badge id-badge">#{{ task.id }}</span>
            <span v-if="userRole === 'admin'" class="badge admin-badge">Admin Only</span>
        </div>
      </div>
    </div>

    <div class="task-actions">
      <button v-if="isEditing" @click.stop="saveEdit" class="btn-icon save" title="Salvar">✓</button>
      <button v-else @click.stop="startEdit" class="btn-icon edit" title="Editar">✎</button>

      <button v-if="userRole === 'admin'" @click.stop="$emit('delete-task', task.id)" class="btn-icon delete" title="Excluir">
        🗑
      </button>
      
      <span class="arrow-indicator">›</span>
    </div>
  </li>
</template>

<script src="./TaskItem.js"></script>
<style lang="scss" src="./TaskItem.scss" scoped></style>