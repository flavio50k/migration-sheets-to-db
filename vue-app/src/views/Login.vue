<template>
    <div class="login-container">
        <div class="auth-card">
            <h2>Acesso ao Sistema</h2>
            <p class="subtitle">Gerenciamento de Migrações</p>
            
            <div class="form-group">
                <input type="text" v-model="username" placeholder="Usuário" required />
            </div>
            <div class="form-group">
                <input type="password" v-model="password" placeholder="Senha" required />
            </div>

            <div class="actions">
                <button class="btn-primary" @click="handleAuth('login')">Entrar</button>
                <button class="btn-secondary" @click="handleAuth('register')">Criar Conta</button>
            </div>

            <p v-if="authMessage" class="message" :class="{ 'success': authSuccess, 'error': !authSuccess }">
                {{ authMessage }}
            </p>
        </div>
    </div>
</template>

<script>
import LoginLogic from './Login.js';
export default {
    name: "LoginView",
    mixins: [LoginLogic],
    methods: {
        async handleAuth(type) {
            const success = await this.authenticate(type);
            if (success) {
                this.$router.push({ name: 'TaskList' });
            }
        }
    }
};
</script>

<style lang="scss" src="./Login.scss" scoped></style>