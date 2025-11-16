<template>
    <div class="login-container">
        <pv-card class="login-card">
            <template #title>
                <div class="text-center">Acesso ao Sistema</div>
            </template>
            <template #subtitle>
                <div class="text-center">Gerenciamento de Migrações</div>
            </template>
            
            <template #content>
                <div class="form-column">
                    <span class="p-float-label">
                        <pv-input id="username" v-model="username" class="w-full" />
                        <label for="username">Usuário</label>
                    </span>

                    <span class="p-float-label mt-4">
                        <pv-password id="password" v-model="password" :feedback="false" toggleMask class="w-full" inputClass="w-full" />
                        <label for="password">Senha</label>
                    </span>

                    <div class="actions-row">
                        <pv-button label="Entrar" @click="handleAuth('login')" :loading="loading" class="w-full" />
                        <pv-button label="Criar Conta" @click="handleAuth('register')" class="p-button-outlined w-full" />
                    </div>

                    <pv-message v-if="authMessage" :severity="authSuccess ? 'success' : 'error'" :closable="false">
                        {{ authMessage }}
                    </pv-message>
                </div>
            </template>
        </pv-card>
    </div>
</template>

<script src="./Login.js"></script>
<style lang="scss" src="./Login.scss" scoped></style>