<template>
    <div class="auth-section">
        <h2>Acesso ao Sistema</h2>
        <input type="text" v-model="username" placeholder="Usuário" required />
        <input type="password" v-model="password" placeholder="Senha" required />

        <button @click="handleAuth('login')">Entrar</button>
        <button @click="handleAuth('register')">Registrar</button>

        <p v-if="authMessage" :style="{ color: authSuccess ? 'green' : 'red' }">
            {{ authMessage }}
        </p>
    </div>
</template>

<script>
import LoginLogic from './Login.js';

export default {
    name: "LoginView",
    mixins: [LoginLogic],
    methods: {
        // Redireciona o usuário para a lista de tarefas após o login
        async handleAuth(type) {
            const success = await this.authenticate(type);
            if (success) {
                this.$router.push({ name: 'TaskList' });
            }
        }
    }
};
</script>