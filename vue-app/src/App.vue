<template>
  <div id="app">
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