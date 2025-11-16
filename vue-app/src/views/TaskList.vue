<template>
  <div class="task-dashboard">
    
    <div class="dashboard-toolbar">
      <div class="search-add-group">
        <div class="p-inputgroup">
            <pv-input 
                v-model="newTaskTitle" 
                placeholder="Adicionar nova tarefa..." 
                @keyup.enter="createTask" 
            />
            <pv-button 
                icon="pi pi-plus" 
                @click="createTask" 
                :disabled="!newTaskTitle.trim()" 
            />
        </div>
      </div>

      <div class="filter-group">
        <pv-dropdown 
            v-model="filterStatus" 
            :options="statusOptions" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Filtrar Status"
            @change="handleFilterChange"
            class="status-dropdown"
        />
        
        <pv-button 
            icon="pi pi-refresh" 
            class="p-button-outlined p-button-secondary" 
            @click="loadTasks" 
            v-tooltip="'Atualizar Lista'"
        />
      </div>
    </div>

    <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

    <div class="task-container">
        <div v-if="tasks.length === 0" class="empty-state">
            <i class="pi pi-folder-open" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Nenhuma tarefa encontrada.</p>
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