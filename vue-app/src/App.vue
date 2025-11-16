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

<script src="./App.js"></script>

<style lang="scss" src="./App.scss"></style>