/* vue-app/src/views/Login.js */
import axios from "axios";
const API_URL = "/api";

export default {
  name: "LoginLogic",
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

        // --- CORREÇÃO 1: Salvar o nome digitado na memória do navegador ---
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("username", this.username); // Salva o nome do usuário
        
        // --- CORREÇÃO 2: Enviar o nome explicitamente para o App.vue ---
        this.$emit('update-auth', { 
            token: token, 
            role: role, 
            username: this.username 
        });

        this.authSuccess = true;
        this.authMessage = message || `Sucesso! Bem-vindo(a) ${this.username}.`;
        
        // Não limpamos o this.username aqui para ele não sumir antes do redirecionamento
        this.password = ""; 
        return true; 
      } catch (error) {
        this.authSuccess = false;
        
        /* Obtém a mensagem de erro do backend ou uma mensagem padrão */
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão ou credenciais inválidas.';

        this.authMessage = `Falha no ${type}: ${errorMessage}`;
        console.error(`Falha ao ${type}:`, error);
        return false; 
      }
    }
  }
};