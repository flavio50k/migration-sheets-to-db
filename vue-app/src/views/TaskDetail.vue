<template>
  <div class="task-detail-view">
    <h2>Tarefa Selecionada: {{ taskTitle }} (ID: {{ id }})</h2>
    <p v-if="loading">Carregando detalhes da tarefa...</p>
    <hr>
    
    <MigrationUpload 
      :token="token" 
      :taskId="id" 
      @migration-complete="handleMigrationComplete" 
    />

    <button @click="$router.push({ name: 'TaskList' })" class="back-btn">
        &larr; Voltar para a Lista de Tarefas
    </button>
  </div>
</template>

<script>
import MigrationUpload from "../components/migration/MigrationUpload.vue";
import axios from 'axios';
const API_URL = "/api"; 

export default {
  name: "TaskDetail",
  components: { MigrationUpload },
  props: {
    // 'id' é injetado automaticamente pelo Vue Router (props: true)
    id: { type: [String, Number], required: true },
    // Recebe o token e userRole do <router-view> no App.vue
    token: { type: String, required: true },
    userRole: { type: String, required: true },
  },
  data() {
    return {
      taskTitle: `Tarefa #${this.id}`,
      loading: true,
    };
  },
  mounted() {
    this.fetchTaskTitle();
  },
  methods: {
    async fetchTaskTitle() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/tasks/${this.id}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        // Assumindo que o backend retorna { task: { title: '...' } }
        this.taskTitle = response.data.task.title;
      } catch (error) {
        console.error("Erro ao carregar o título da tarefa:", error);
        this.taskTitle = `Tarefa #${this.id} (Não encontrada ou erro)`;
        // Chama o tratador de erro global para gerenciar 401/403
        this.$root.handleApiCall("carregar título da tarefa", error);
      } finally {
        this.loading = false;
      }
    },
    handleMigrationComplete() {
      // Feedback após o upload (opcional)
      alert(`Upload concluído com sucesso para a Tarefa #${this.id}!`);
    }
  },
};
</script>

<style scoped>
.task-detail-view {
  padding: 10px 0;
}
.back-btn {
  margin-top: 20px;
  background-color: #6c757d;
}
</style>