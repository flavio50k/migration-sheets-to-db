<template>
  <div class="task-list-view">
    <MigrationUpload :token="token" @migration-complete="loadTasks" />
    <hr />

    <h3>Gestão de Tarefas (Tasks)</h3>
    <button @click="loadTasks">Carregar/Atualizar Tarefas</button>

    <div class="new-task-area">
      <input type="text" v-model="newTaskTitle" placeholder="Título da nova tarefa" @keyup.enter="createTask" />
      <button @click="createTask" :disabled="!newTaskTitle.trim()">
        Adicionar Tarefa
      </button>
    </div>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <ul class="task-list">
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" :userRole="userRole" @delete-task="deleteTask"
        @toggle-complete="toggleTaskCompleted" @update-task="updateTask" @select-task="handleSelectTask" />
    </ul>
  </div>
</template>

<script>
// Importa o mixin com toda a lógica de API
import TaskLogic from "../mixins/TaskLogic.js";
// Importa os componentes filhos
import TaskItem from "../components/task/TaskItem.vue";
import MigrationUpload from "../components/migration/MigrationUpload.vue";

export default {
  name: "TaskList",
  // O mixin TaskLogic agora gerencia o 'tasks', 'newTaskTitle', e 'errorMessage'
  mixins: [TaskLogic],
  components: {
    TaskItem,
    MigrationUpload,
  },
  // O App.vue injeta estas props via <router-view>
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
/* O TaskList.vue não precisa de estilos pesados, 
pois App.scss e TaskItem.scss já cuidam da aparência. */
.new-task-area {
  display: flex;
  margin: 20px 0;
}

.new-task-area input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.error-msg {
  color: red;
  font-weight: bold;
}
</style>