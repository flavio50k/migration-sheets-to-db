<template>
  <div id="app">
    <h1>📋 Projeto FullStack - Tarefas Vue.js</h1>
    <p>Conectado ao Backend em: **{{ apiUrl }}**</p>
    <hr />
    
    <header v-if="token" class="header">
      <h2>Suas Tarefas (Role: {{ userRole }})</h2>
      <button @click="logout">Sair</button> 
    </header>

    <router-view 
      :token="token" 
      :userRole="userRole" 
      @update-auth="updateAuth" 
    />

  </div>
</template>

<script>
import AppLogic from './App.js'; 

export default {
  name: "App",
  mixins: [AppLogic],
};
</script>