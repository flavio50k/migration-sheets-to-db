/* vue-app/src/main.js */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* --- IMPORTAÇÕES DO PRIMEVUE --- */
import PrimeVue from 'primevue/config';

/* Estilo do Tema (Escolhido 'Aura' que é moderno, mas pode ser 'Saga', 'Lara', etc) */
import 'primevue/resources/themes/aura-light-green/theme.css';      
/* Estilos Base (Layout Core) */
import 'primevue/resources/primevue.min.css';                 
/* Ícones */
import 'primeicons/primeicons.css';                             

const app = createApp(App);

/* Registrar o Plugin */
app.use(PrimeVue); 
app.use(router);

app.mount('#app');