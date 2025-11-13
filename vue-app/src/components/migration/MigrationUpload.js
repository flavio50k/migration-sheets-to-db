/* vue-app/src/components/migration/MigrationUpload.js */
import axios from 'axios';

const API_URL = "/api";

export default {
  name: 'MigrationUpload',
  props: {
    /* Propriedade herdada do App.vue para autenticação  */
    token: {
      type: String,
      required: true
    },
    /* ID da Tarefa para rotear o upload */
    taskId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      selectedFile: null,
      isUploading: false,
      message: null,
      messageType: null,
      migrationData: null,
    };
  },
  methods: {
    triggerFileInput() {
      /* Abre o diálogo nativo de seleção de arquivo */
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      /* Captura o arquivo selecionado */
      this.selectedFile = event.target.files[0];
      this.message = this.selectedFile ? `Arquivo '${this.selectedFile.name}' selecionado.` : null;
      this.messageType = 'info';
    },

    async uploadFile() {
      if (!this.selectedFile) {
        this.message = 'Selecione um arquivo para continuar.';
        this.messageType = 'error';
        return;
      }

      this.isUploading = true;
      this.message = 'Enviando arquivo... Por favor, aguarde.';
      this.messageType = 'info';
      this.migrationData = null;

      /* FormData é essencial para uploads de arquivos via API REST */
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        /* Inclui o ID da tarefa no endpoint */
        const response = await axios.post(`${API_URL}/tasks/${this.taskId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.message = 'Upload realizado com sucesso! Pronto para o próximo passo.';
        this.messageType = 'success';
        this.migrationData = response.data.file;
        /* Opcional: emitir evento para que a lista de tarefas atualize, se necessário */
        this.$emit('migration-complete');

      } catch (error) {
        this.isUploading = false;
        this.selectedFile = null;
      } finally {
        this.isUploading = false;
        this.selectedFile = null;
      }
    },
  },
};