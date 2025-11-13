// ./vue-app/src/main.js 

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Cria e monta a aplicação Vue no elemento <div id="app">
const app = createApp(App);
app.use(router); // Usa o Vue Router
app.mount('#app');