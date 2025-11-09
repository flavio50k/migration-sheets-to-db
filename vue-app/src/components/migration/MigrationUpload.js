/* vue-app/src/components/migration/MigrationUpload.js - Refatorado */
import axios from 'axios';

const API_URL = "/api";

export default {
  // ... (props e data inalterados, exceto abaixo)
  data() {
    return {
      selectedFile: null,
      isUploading: false,
      message: null,
      messageType: null,
      importData: null, // CORRIGIDO: migrationData -> importData
    };
  },
  methods: {
    // ... (triggerFileInput e handleFileChange inalterados) ...

    async uploadFile() {
      // ... (código de validação inalterado) ...
      this.isUploading = true;
      this.message = 'Enviando arquivo... Por favor, aguarde.';
      this.messageType = 'info';
      this.importData = null; // CORRIGIDO: migrationData -> importData

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        // CORREÇÃO CRÍTICA: Rota alterada para alinhamento com a nomenclatura Task
        const response = await axios.post(`${API_URL}/tasks/upload`, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data', 
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.message = 'Upload realizado com sucesso! Uma nova Tarefa foi criada para processamento.';
        this.messageType = 'success';
        this.importData = response.data.file; // CORRIGIDO: migrationData -> importData
        this.$emit('migration-complete'); 
        
      } catch (error) {
        // ... (código de erro inalterado) ...
      } finally {
        this.isUploading = false;
        this.selectedFile = null; 
        this.$refs.fileInput.value = null;
      }
    }
  }
};