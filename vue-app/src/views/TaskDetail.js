/* vue-app/src/views/TaskDetail.js */

import axios from 'axios'; // Importar Axios
import MigrationUpload from "../components/migration/MigrationUpload.vue";

const API_URL = "/api";

export default {
  name: "TaskDetail",
  components: {
    MigrationUpload,
  },
  props: {
    id: { type: [String, Number], required: true },
    token: { type: String, required: true },
    userRole: { type: String, default: 'user' },
  },
  data() {
    return {
      task: null,
      isLoading: true,
      errorMessage: ''
    };
  },
  computed: {
    taskId() {
      return this.id;
    },
  },

  mounted() {
    this.fetchTaskDetails();
  },
  methods: {
    async fetchTaskDetails() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${API_URL}/tasks/${this.taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.task = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar detalhes da tarefa.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    handleMigrationComplete() {
      console.log(`Upload concluído para a Tarefa ID: ${this.taskId}`);
      this.fetchTaskDetails();
    }
  }
};