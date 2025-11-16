<template>
  <div class="task-dashboard">
    
    <div class="dashboard-toolbar">
      <div class="search-add-group">
        <div class="input-wrapper">
            <input type="text" v-model="newTaskTitle" placeholder="Adicionar nova tarefa..." @keyup.enter="createTask" />
            <button class="btn-add" @click="createTask" :disabled="!newTaskTitle.trim()">+</button>
        </div>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" @change="handleFilterChange">
            <option value="all">Todas as Tarefas</option>
            <option value="open">Em Aberto</option>
            <option value="completed">Concluídas</option>
        </select>
        <button @click="loadTasks" class="btn-refresh" title="Atualizar">↻</button>
      </div>
    </div>

    <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

    <div class="task-container">
        <div v-if="tasks.length === 0" class="empty-state">
            Nenhuma tarefa encontrada.
        </div>
        <ul class="task-list-grid">
            <TaskItem 
                v-for="task in tasks" 
                :key="task.id" 
                :task="task" 
                :userRole="userRole" 
                @delete-task="deleteTask"
                @toggle-complete="toggleTaskCompleted" 
                @update-task="updateTask" 
                @select-task="handleSelectTask" 
            />
        </ul>
    </div>
  </div>
</template>

<script src="./TaskList.js"></script>

<style lang="scss" src="./TaskList.scss" scoped></style>