<template>
  <div id="app">
    <h1>📋 Projeto FullStack - Tarefas Vue.js</h1>
    <p>Conectado ao Backend em: **{{ apiUrl }}**</p>
    <hr />

    <div v-if="!token" class="auth-section">
      <h2>Acesso ao Sistema</h2>
      <input type="text" v-model="username" placeholder="Usuário" required />
      <input type="password" v-model="password" placeholder="Senha" required />
      <button @click="handleAuth('login')">Entrar</button>
      <button @click="handleAuth('register')">Registrar</button>
      <p v-if="authMessage" :style="{ color: authSuccess ? 'green' : 'red' }">
        {{ authMessage }}
      </p>
    </div>

    <div v-else class="app-section">
      <div class="header">
        <h2>Suas Tarefas (Role: {{ userRole }})</h2>
        <button @click="logout">Sair</button>
      </div>

      <MigrationUpload :token="token" @migration-complete="loadTasks" />
      <hr>

      <h3>Gestão de Projetos (Tasks)</h3>
      <button @click="loadTasks">Carregar/Atualizar Tarefas</button>

      <div class="new-task-area">
        <input type="text" v-model="newTaskTitle" placeholder="Título do novo projeto/tarefa"
          @keyup.enter="createTask" />
        <button @click="createTask" :disabled="!newTaskTitle.trim()">
          Adicionar Projeto
        </button>
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <ul class="task-list">
        <TaskItem v-for="task in tasks" :key="task.id" :task="task" :userRole="userRole" @delete-task="deleteTask"
          @toggle-complete="toggleTaskCompleted" @update-task="updateTask" />
      </ul>
    </div>
  </div>
</template>

<script>
import AppLogic from './App.js'; // Importa o objeto de lógica/script

// 🐛 CORRIGIDO: Atualiza o caminho para a nova estrutura de pastas
import TaskItem from "./components/task/TaskItem.vue";
import MigrationUpload from "./components/migration/MigrationUpload.vue";

export default {
  name: "App",
  // 1. O componente Vue precisa declarar quais filhos ele usará
  components: {
    TaskItem,
    MigrationUpload,
  },
  // 2. Espalha todas as propriedades de data, methods, e mounted do App.js
  ...AppLogic,
};
</script>

<style lang="scss">
/* Importa o arquivo de estilos SCSS para uso global no componente */
@import "./App.scss";
</style>