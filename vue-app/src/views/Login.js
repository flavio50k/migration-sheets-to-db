/* vue-app/src/views/Login.js */
import axios from "axios";
const API_URL = "/api";

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

export default {
  name: "LoginView",
  components: {
      'pv-card': Card,
      'pv-input': InputText,
      'pv-password': Password,
      'pv-button': Button,
      'pv-message': Message
  },
  data() {
    return {
      username: "",
      password: "",
      authMessage: null,
      authSuccess: false,
      loading: false
    };
  },
  methods: {
    /* --- Função Principal chamada pelo botão (CORREÇÃO AQUI) --- */
    async handleAuth(type) {
        // 1. Chama a lógica de autenticação
        const success = await this.authenticate(type);
        
        // 2. Se funcionou, redireciona para a lista de tarefas
        if (success) {
            this.$router.push({ name: 'TaskList' });
        }
    },

    /* --- Lógica de API e Sessão --- */
    async authenticate(type) {
      this.loading = true;
      this.authMessage = null;
      
      const endpoint = type === "login" ? "login" : "register";
      
      try {
        const response = await axios.post(`${API_URL}/users/${endpoint}`, {
          username: this.username,
          password: this.password,
        });

        const { token, role, message } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("username", this.username);
        
        this.$emit('update-auth', { token, role, username: this.username });

        this.authSuccess = true;
        this.authMessage = message || `Bem-vindo(a) ${this.username}.`;
        this.password = ""; 
        return true;
      } catch (error) {
        this.authSuccess = false;
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão.';
        this.authMessage = errorMessage;
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
};