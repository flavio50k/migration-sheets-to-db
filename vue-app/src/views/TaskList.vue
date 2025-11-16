<template>
  <div class="task-list-view">

    <h3>Gestão de Tarefas (Tasks)</h3>

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
      this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
    }
  }
};
</script>

<style scoped>
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