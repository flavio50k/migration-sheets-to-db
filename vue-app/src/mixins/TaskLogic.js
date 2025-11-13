/* vue-app/src/mixins/TaskLogic.js */
import axios from "axios";
const API_URL = "/api"; 

export default {
  /* Assume que 'token' e 'userRole' são passados via props pela view que usa este mixin */
  props: ['token', 'userRole'], 
  data() {
    return {
      tasks: [],
      newTaskTitle: "",
      errorMessage: null,
    };
  },
  
  /* Carrega as tarefas ao montar o componente (view) */
  mounted() {
    if (this.token) {
      this.loadTasks();
    }
    /* Ouve o evento de erro de autenticação emitido pelo App.js (caso o token expire) */
    this.$root.$on('auth-error', this.clearTasksOnError);
  },
  
  beforeUnmount() {
    /* Remove o listener ao destruir o componente */
    this.$root.$off('auth-error', this.clearTasksOnError);
  },

  methods: {
    /* Adapter para usar o handleApiCall do componente raiz (App.js) */
    handleApiCall(action, error) {
      /* 1. Chama a função de erro no componente raiz (App.js) para tratar 401/403 (logout)*/
      const messageFromRoot = this.$root.handleApiCall(action, error);
      
      /* 2. Se a mensagem não for vazia, exibe localmente. */
      if (messageFromRoot) {
        this.errorMessage = messageFromRoot;
      }
    },
    
    /* Limpa as tarefas em caso de erro de autenticação forçado pelo App.js */
    clearTasksOnError() {
        this.tasks = [];
    },

    async loadTasks() {
      this.errorMessage = null;
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        /* Adaptação: Assumindo que o backend retorna { tasks: [...] } ou apenas [...] */
        this.tasks = response.data.tasks || response.data; 
      } catch (error) {
        this.handleApiCall("carregar tarefas", error);
      }
    },
    
    async createTask() {
      if (!this.newTaskTitle.trim()) return;
      try {
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
        await axios.put(
          `${API_URL}/tasks/${taskId}/complete`, 
          { completed: completedStatus },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.loadTasks();
      } catch (error) {
        this.handleApiCall("atualizar status da tarefa", error);
      }
    },
 
    async updateTask(taskId, updateData) {
      try {
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
  },
};