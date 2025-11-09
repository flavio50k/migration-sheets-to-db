/* vue-app/src/App.js  */
import axios from "axios";
// O API_URL é o prefixo de proxy definido no Nginx.
const API_URL = "/api"; 

export default {
  // A propriedade 'components' foi removida e movida para App.vue.
  data() {
    return {
      apiUrl: API_URL, 
      token: localStorage.getItem("token") || null,
      userRole: localStorage.getItem("userRole") || "user",
      username: "",
      password: "",
      authMessage: null,
      authSuccess: false,
      task: [],
      newTaskTitle: "",
      errorMessage: null,
    };
  },
  
  mounted() {
    if (this.token) {
      this.loadTask();
    }
  },

  methods: {
    handleApiCall(action, error) {
      console.error(`Erro ao ${action}:`, error);
      // Extrai mensagem de erro do backend para melhor diagnóstico
      this.errorMessage =
        error.response?.data?.error?.message ||
        `Erro ao ${action}. Verifique a conexão com o backend.`;
      
      // Se for um erro de autenticação (401/403), força o logout
      if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
          this.authMessage = this.errorMessage;
          this.authSuccess = false;
      }
      this.loadTask(); 
    },

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

        // Salva o token e a role
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        
        this.token = token;
        this.userRole = role;
        
        this.authSuccess = true;
        this.authMessage = message || `Sucesso! Bem-vindo(a) ${this.username}.`;
        this.password = "";
        this.loadTask();

      } catch (error) {
        this.authSuccess = false;
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão ou credenciais inválidas.';
        this.authMessage = `Falha no ${type}: ${errorMessage}`;
        this.handleApiCall("fazer autenticação", error);
      }
    },

    async loadTask() {
      this.errorMessage = "";
      try {
          const response = await axios.get(`${API_URL}/task`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.task = response.data;
      } catch (error) {
        this.handleApiCall("carregar tarefas", error);
      }
    },

    async createTask() {
      if (!this.newTaskTitle.trim()) return;

      try {
        // CORREÇÃO MANTIDA: Rota deve ser /task
        await axios.post(`${API_URL}/task`, { title: this.newTaskTitle }, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.newTaskTitle = "";
        this.loadTask();
      } catch (error) {
        this.handleApiCall("criar tarefa", error);
      }
    },
 
    async toggleTaskCompleted(taskId, completedStatus) {
      try {
        // CORREÇÃO MANTIDA: Rota deve ser /task
        await axios.put(
          `${API_URL}/task/${taskId}`,
          { completed: completedStatus },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.loadTask();
      } catch (error) {
        this.handleApiCall("atualizar tarefa", error);
      }
    },
 
    async updateTask(taskId, updateData) {
      try {
        // CORREÇÃO MANTIDA: Rota deve ser /task
        await axios.put(`${API_URL}/task/${taskId}`, updateData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.loadTask();
      } catch (error) {
        this.handleApiCall("atualizar tarefa", error);
      }
    },
 
    async deleteTask(taskId) {
      if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

      try {
        // CORREÇÃO MANTIDA: Rota deve ser /task
        await axios.delete(`${API_URL}/task/${taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.loadTask();
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Ação proibida: Você não tem permissão para excluir esta tarefa.");
        } else {
          this.handleApiCall("excluir tarefa", error);
        }
        this.loadTask();
      }
    },

    logout() {
      localStorage.clear();
      this.token = null;
      this.userRole = "user";
      this.task = [];
      this.authMessage = "Você saiu do sistema.";
      this.authSuccess = true;
    },
  },
};