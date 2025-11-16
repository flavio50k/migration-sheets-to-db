<template>
  <div class="task-detail-container">
    
    <div class="detail-header">
        <h2>Detalhe da Tarefa #{{ taskId }}</h2>
        <button class="back-btn" @click="$router.push({ name: 'TaskList' })">
            ↩ Voltar
        </button>
    </div>

    <div class="detail-content">
        <MigrationUpload :token="token" :taskId="taskId" @migration-complete="handleMigrationComplete" />
    </div>

  </div>
</template>

<script src="./TaskDetail.js"></script>
<style lang="scss" src="./TaskDetail.scss" scoped></style>