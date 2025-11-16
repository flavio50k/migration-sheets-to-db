/* vue-app/src/App.js */
import axios from "axios";
const API_URL = "/api";

export default {
  name: "App",
  data() {
    return {
      apiUrl: API_URL,
      token: sessionStorage.getItem("token") || null,
      userRole: sessionStorage.getItem("userRole") || "user",
      username: sessionStorage.getItem("username") || "Usuário",
    };
  },

  methods: {
    updateAuth({ token, role, username }) {
      this.token = token;
      this.userRole = role;

      if (username) {
        this.username = username;
      }
    },

    handleApiCall(action, error) {
      console.error(`Erro ao ${action}:`, error);
      const errorMessage =
        error.response?.data?.error?.message ||
        `Erro ao ${action}. Verifique a conexão com o backend.`;

      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
        this.authMessage = errorMessage;
        this.$root.$emit('auth-error', errorMessage);
        return errorMessage;
      }
      return errorMessage;
    },

    logout() {
      sessionStorage.clear();
      this.token = null;
      this.userRole = "user";
      this.username = "Usuário";
      window.location.href = '/login';
    }
  },
};