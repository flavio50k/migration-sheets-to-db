<template>
  <div class="task-detail-view">

    <h2>Detalhe da Tarefa #{{ taskId }}</h2>

    <MigrationUpload :token="token" :taskId="taskId" @migration-complete="handleMigrationComplete" />

    <button @click="$router.push({ name: 'TaskList' })">
      ↩ Voltar para a Lista
    </button>
  </div>
</template>

<script>
import MigrationUpload from "../components/migration/MigrationUpload.vue";

export default {
  name: "TaskDetail",
  components: {
    MigrationUpload,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userRole: { /* Não é usado diretamente, mas pode ser passado para componentes filhos se necessário */
      type: String,
      default: 'user',
    },
  },
  computed: {
    taskId() {
      return this.id;
    },
  },
  methods: {
    handleMigrationComplete() {
      console.log(`Upload concluído para a Tarefa ID: ${this.taskId}`);
    }
  }
};
</script>

<style scoped>
.task-detail-view {
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  margin-top: 20px;
}

.task-detail-view button {
  margin-top: 20px;
}
</style>