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
      
      <router-view 
        :token="token" 
        :userRole="userRole" 
      />
    </div>
  </div>
</template>

<script>
import AppLogic from './App.js'; 

export default {
  name: "App",
  mixins: [AppLogic],
  
  watch: {
    token(newToken) {
      if (newToken) {
        // Navega após um LOGIN bem-sucedido
        this.$router.push({ name: 'TaskList' }); 
      } else {
        // Navega após um LOGOUT ou erro 401 forçado
        this.$router.push('/');
      }
    }
  }
};
</script>

<style lang="scss">
@import "./App.scss";
</style>