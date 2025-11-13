/* vue-app/src/App.js  */
import axios from "axios";
const API_URL = "/api"; 

export default {
  data() {
    return {
      apiUrl: API_URL, 
      token: localStorage.getItem("token") || null,
      userRole: localStorage.getItem("userRole") || "user",
      username: "",
      password: "",
      authMessage: null,
      authSuccess: false,
      /* REMOVIDO: tasks, newTaskTitle, errorMessage */
    };
  },
  
  /* REMOVIDO: mounted() - A lógica de carregamento agora está no TaskList.vue */
  
  methods: {
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
    
    /* handleAuth (mantido, mas sem chamar loadTasks) */
    async handleAuth(type) {
      if (!this.username.trim() || !this.password.trim()) {
        this.authMessage = "Usuário e senha são obrigatórios.";
        this.authSuccess = false;
        return;
      }

      this.authMessage = type === 'login' ? 'Tentando login...' : 'Tentando registro...';
      this.authSuccess = false;
      const endpoint = type === "login" ? "login" : "register";

      try {
        const response = await axios.post(`${API_URL}/users/${endpoint}`, {
          username: this.username,
          password: this.password,
        });

        const { token, role, message } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        
        this.token = token;
        this.userRole = role;
        
        this.authSuccess = true;
        this.authMessage = message || `Sucesso! Bem-vindo(a) ${this.username}.`;
        this.password = "";
        /* REMOVIDO: this.loadTasks() - A navegação para /tasks é feita em App.vue */
      } catch (error) {
        this.authSuccess = false;
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão ou credenciais inválidas.';
        this.authMessage = `Falha no ${type}: ${errorMessage}`;
        this.handleApiCall("fazer autenticação", error);
      }
    },

    /* logout (mantido) */
    logout() {
      localStorage.clear();
      this.token = null;
      this.userRole = "user";
      // REMOVIDO: this.tasks = [];
      this.authMessage = "Você saiu do sistema.";
      this.authSuccess = true;
    },

    /* REMOVIDO: loadTasks, createTask, toggleTaskCompleted, updateTask, deleteTask */
  },
};