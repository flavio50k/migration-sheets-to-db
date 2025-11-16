/* vue-app/src/App.js */
import axios from "axios";
const API_URL = "/api";

export default {
  name: "App", /* Adicionado para identificar o componente */
  data() {
    return {
      apiUrl: API_URL,
      token: sessionStorage.getItem("token") || null,
      userRole: sessionStorage.getItem("userRole") || "user",
    };
  },

  methods: {
    /* Atualiza o estado global com os dados de autenticação. */
    updateAuth({ token, role }) {
      this.token = token;
      this.userRole = role;
    },

    handleApiCall(action, error) {
      console.error(`Erro ao ${action}:`, error);
      const errorMessage =
        error.response?.data?.error?.message ||
        `Erro ao ${action}. Verifique a conexão com o backend.`;

      /* Se for um erro de autenticação (401/403), força o logout */
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
        this.authMessage = errorMessage;
        /* Adiciona um evento root para a view de tarefas poder limpar o estado */
        this.$root.$emit('auth-error', errorMessage);
        return errorMessage; /* Retorna a mensagem para quem chamou */
      }
      return errorMessage; /* Retorna a mensagem de erro */
    },

    logout() {
      sessionStorage.clear();
      this.token = null;
      this.userRole = "user";
      window.location.href = '/login'; 
    }
  },
};