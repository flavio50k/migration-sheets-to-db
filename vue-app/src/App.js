/* vue-app/src/App.js */
import axios from "axios";
// O API_URL é o prefixo de proxy definido no Nginx.
const API_URL = "/api"; 

// Este arquivo exporta apenas o objeto de lógica (data, methods, etc.)
// As importações de componentes (TaskItem, MigrationUpload) foram movidas para App.vue.

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
      tasks: [],
      newTaskTitle: "",
      errorMessage: null,
    };
  },
  
  mounted() {
    if (this.token) {
      this.loadTasks();
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
      this.loadTasks(); 
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
        this.loadTasks();

      } catch (error) {
        this.authSuccess = false;
        const errorMessage = error.response?.data?.error?.message || 'Erro de conexão ou credenciais inválidas.';
        this.authMessage = `Falha no ${type}: ${errorMessage}`;
        this.handleApiCall("fazer autenticação", error);
      }
    },

    async loadTasks() {
      this.errorMessage = "";
      try {
        // CORREÇÃO MANTIDA: Rota deve ser /tasks (para resolver o erro inicial de Login/Registro/CRUD)
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.tasks = response.data;
      } catch (error) {
        this.handleApiCall("carregar tarefas", error);
      }
    },

    async createTask() {
      if (!this.newTaskTitle.trim()) return;

      try {
        // CORREÇÃO MANTIDA: Rota deve ser /tasks
        await axios.post(`${API_URL}/tasks`, { title: this.newTaskTitle }, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.newTaskTitle = "";
        this.loadTasks();
      } catch (error) {
        this.handleApiCall("criar tarefa", error);
      }
    },
 
    async toggleTaskCompleted(taskId, completedStatus) {
      try {
        // CORREÇÃO MANTIDA: Rota deve ser /tasks
        await axios.put(
          `${API_URL}/tasks/${taskId}`,
          { completed: completedStatus },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.loadTasks();
      } catch (error) {
        this.handleApiCall("atualizar tarefa", error);
      }
    },
 
    async updateTask(taskId, updateData) {
      try {
        // CORREÇÃO MANTIDA: Rota deve ser /tasks
        await axios.put(`${API_URL}/tasks/${taskId}`, updateData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.loadTasks();
      } catch (error) {
        this.handleApiCall("atualizar tarefa", error);
      }
    },
 
    async deleteTask(taskId) {
      if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

      try {
        // CORREÇÃO MANTIDA: Rota deve ser /tasks
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.loadTasks();
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Ação proibida: Você não tem permissão para excluir esta tarefa.");
        } else {
          this.handleApiCall("excluir tarefa", error);
        }
        this.loadTasks();
      }
    },

    logout() {
      localStorage.clear();
      this.token = null;
      this.userRole = "user";
      this.tasks = [];
      this.authMessage = "Você saiu do sistema.";
      this.authSuccess = true;
    },
  },
};