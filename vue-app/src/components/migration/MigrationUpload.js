/* vue-app/src/components/migration/MigrationUpload.js */
import axios from 'axios';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';

const API_URL = "/api";

export default {
  name: 'MigrationUpload',
  components: {
      'pv-button': Button,
      'pv-progress': ProgressBar
  },
  props: {
    token: { type: String, required: true },
    taskId: { type: [String, Number], required: true }
  },
  data() {
    return {
      selectedFile: null,
      isUploading: false,
      message: null,
      messageType: null,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.message = null;
    },
    async uploadFile() {
      if (!this.selectedFile) return;

      this.isUploading = true;
      this.message = null;

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
         await axios.post(`${API_URL}/migrations/${this.taskId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.message = 'Upload realizado com sucesso!';
        this.messageType = 'success';
        this.$emit('migration-complete');

      } catch (error) {
        this.message = 'Erro ao enviar o arquivo.';
        this.messageType = 'error';
      } finally {
        this.isUploading = false;
      }
    }
  }
};