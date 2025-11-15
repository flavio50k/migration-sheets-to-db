<template>
  <div class="task-detail-view">
    <h2>Detalhe da Tarefa #{{ taskId }}</h2>
    <p>
      Esta é a tela de detalhes para a tarefa com ID **{{ taskId }}**.
      Aqui, o componente faria uma chamada à API para carregar mais
      informações sobre a tarefa.
    </p>

    <button @click="$router.push({ name: 'TaskList' })">
      ↩ Voltar para a Lista
    </button>
  </div>
</template>

<script>
export default {
  name: "TaskDetail",
  props: {
    // Esta prop é injetada automaticamente pelo Vue Router (ver index.js)
    id: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    taskId() {
      return this.id;
    },
  },
};
</script>

<style scoped>
.task-detail-view {
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  margin-top: 20px;
}
</style>