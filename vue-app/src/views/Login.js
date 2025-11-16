/* vue-app/src/views/Login.js */
import axios from "axios";
const API_URL = "/api";

export default {
  data() {
    return {
      /* Dados do formulário de login/registro */
      username: "",
      password: "",
      /* Mensagens de status */
      authMessage: null,
      authSuccess: false,
    };
  },

  methods: {
    /**
     * Tenta fazer login ou registro.
     * @param {string} type 'login' ou 'register'
     * @returns {boolean} true se a autenticação foi bem-sucedida, false caso contrário.
     */
    async authenticate(type) {
      this.authMessage = type === "login" ? "Tentando login..." : "Tentando registro...";
      this.authSuccess = false;
      const endpoint = type === "login" ? "login" : "register";
      
      try {
        const response = await axios.post(`${API_URL}/users/${endpoint}`, {
          username: this.username,
          password: this.password,
        });

        const { token, role, message } = response.data;

        /* Armazenar o token e role no sessionStorage (MANTER CONSISTÊNCIA) */
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userRole", role);
        
        /* Notifica o App.vue para atualizar o estado global (via mixin do App.js) */
        this.$emit('update-auth', { token, role });

        this.authSuccess = true;
        this.authMessage = message || `Sucesso! Bem-vindo(a) ${this.username}.`;
        this.password = "";
        return true; /* Sucesso para a View gerenciar a navegação */
      } catch (error) {
        this.authSuccess = false;
        
        /* Obtém a mensagem de erro do backend ou uma mensagem padrão */
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão ou credenciais inválidas.';

        this.authMessage = `Falha no ${type}: ${errorMessage}`;
        console.error(`Falha ao ${type}:`, error);
        return false; /* Retorna falha para a View gerenciar */
      }
    },
  },
};