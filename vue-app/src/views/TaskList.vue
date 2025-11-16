<template>
  <div class="task-list-view">

    <h3>Gestão de Tarefas (Tasks)</h3>
    
    <div class="new-task-area">
      <input type="text" v-model="newTaskTitle" placeholder="Título da nova tarefa" @keyup.enter="createTask" />
      <button @click="createTask" :disabled="!newTaskTitle.trim()">
        Adicionar Tarefa
      </button>
    </div>

    <div class="filter-area">
        <label for="task-filter">Filtrar Tarefas:</label>
        <select id="task-filter" v-model="filterStatus" @change="handleFilterChange">
            <option value="all">Todas</option>
            <option value="open">Em Andamento</option>
            <option value="completed">Finalizadas</option>
        </select>
        <button @click="loadTasks" class="refresh-btn">🔄 Atualizar Lista</button>
    </div>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <ul class="task-list">
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" :userRole="userRole" @delete-task="deleteTask"
        @toggle-complete="toggleTaskCompleted" @update-task="updateTask" @select-task="handleSelectTask" />
    </ul>
  </div>
</template>

<script>
import TaskLogic from "../mixins/TaskLogic.js";
import TaskItem from "../components/task/TaskItem.vue";

export default {
  name: "TaskList",
  mixins: [TaskLogic],
  components: {
    TaskItem,
  },
  props: {
    token: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleSelectTask(taskId) {
      // Navega para a rota de detalhe da tarefa
      this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
    }
  }
};
</script>

<style scoped>
/* Estilos para o novo filtro */
.filter-area {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f9fa; /* Fundo claro para realçar */
}

.filter-area label {
    font-weight: bold;
    color: #333;
}

.filter-area select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 150px;
}

.refresh-btn {
    background-color: #6c757d; /* Cor Cinza para atualizar */
    color: white;
}
</style>