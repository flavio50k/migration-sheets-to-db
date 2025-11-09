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
      // Captura o arquivo selecionado
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
        const response = await axios.post(`${API_URL}/migrations/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Essencial para o upload
            'Authorization': `Bearer ${this.token}`,
          },
        });

        /* O backend retornará o status 200 e os metadados do arquivo em caso de sucesso */
        this.message = 'Upload realizado com sucesso! Pronto para o próximo passo.';
        this.messageType = 'success';
        this.migrationData = response.data.file;

      } catch (error) {
        console.error('Erro no upload:', error);
        this.message = error.response?.data?.error?.message || 'Erro ao fazer upload da planilha. Verifique os logs do Backend.';
        this.messageType = 'error';
      } finally {
        this.isUploading = false;
        this.selectedFile = null; // Limpa o arquivo selecionado
        this.$refs.fileInput.value = null; // Reseta o input de arquivo
      }
    }
  }
};