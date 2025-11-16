<template>
  <div class="task-detail-container">
    
    <div class="detail-header">
        <div class="title-group">
            <h2 v-if="task">{{ task.title }}</h2>
            <h2 v-else-if="isLoading">Carregando...</h2>
            <h2 v-else>Tarefa não encontrada</h2>
            
            <span class="badge-id">ID: #{{ taskId }}</span>
        </div>

        <button class="back-btn" @click="$router.push({ name: 'TaskList' })">
            ↩ Voltar
        </button>
    </div>

    <div v-if="task" class="detail-content">
        <p class="status-text">
            Status: <strong>{{ task.completed ? 'Concluída' : 'Em Aberto' }}</strong>
        </p>

        <MigrationUpload :token="token" :taskId="taskId" @migration-complete="handleMigrationComplete" />
    </div>
    
    <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

  </div>
</template>

<script src="./TaskDetail.js"></script>
<style lang="scss" src="./TaskDetail.scss" scoped></style>