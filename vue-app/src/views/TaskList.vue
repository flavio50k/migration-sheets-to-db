<template>
  <div class="task-list-view">
    <h3>Gestão de Tarefas (Tasks)</h3>
    <p>Seu perfil: <strong>{{ userRole }}</strong></p>
    
    <button @click="loadTasks">Carregar/Atualizar Tarefas</button>

    <div class="new-task-area">
      <input type="text" v-model="newTaskTitle" placeholder="Título da nova tarefa"
        @keyup.enter="createTask" />
      <button @click="createTask" :disabled="!newTaskTitle.trim()">
        Adicionar Tarefa
      </button>
    </div>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <ul class="task-list">
      <TaskItem 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        :userRole="userRole" 
        @delete-task="deleteTask"
        @toggle-complete="toggleTaskCompleted" 
        @update-task="updateTask"
        @select-task="goToTaskDetail"
      />
    </ul>
  </div>
</template>

<script>
import TaskItem from "../components/task/TaskItem.vue";
import TaskLogic from "../mixins/TaskLogic.js"; 

export default {
  name: "TaskList",
  components: { TaskItem },
  // TaskLogic traz toda a lógica de estado e métodos de CRUD
  mixins: [TaskLogic], 
  // Recebe token e userRole do <router-view> no App.vue
  props: {
    token: { type: String, required: true },
    userRole: { type: String, required: true },
  },
  
  methods: {
    // Método chamado pelo TaskItem para navegar
    goToTaskDetail(taskId) {
      // Navega usando o nome da rota e passando o ID como parâmetro
      this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
    }
  },
};
</script>

<style lang="scss" scoped>
// Estilos básicos para a view. Pode reutilizar partes do App.scss aqui.
.task-list-view {
  padding: 10px 0;
}
</style>