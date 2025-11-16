<template>
  <div id="app">
    <header v-if="token" class="header">
      <h2>Olá, {{ username }}</h2>
      
      <div class="header-actions">
        <small style="margin-right: 10px; color: #666;">({{ userRole }})</small>
        <button @click="logout">Sair</button> 
      </div>
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