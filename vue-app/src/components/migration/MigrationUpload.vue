<template>
  <div class="upload-card">
    <div class="upload-header">
        <i class="pi pi-cloud-upload icon-large"></i>
        <h3>Importar Planilha</h3>
    </div>
    
    <div class="upload-body">
      <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx, .csv" style="display: none;" />
      
      <div class="file-select-area">
        <pv-button 
            label="Selecionar Arquivo" 
            icon="pi pi-folder-open" 
            class="p-button-outlined"
            @click="triggerFileInput" 
            :disabled="isUploading"
        />
        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
        <span v-else class="file-placeholder">Nenhum arquivo selecionado</span>
      </div>

      <div class="actions">
          <pv-button 
            label="Iniciar Upload" 
            icon="pi pi-upload" 
            @click="uploadFile" 
            :loading="isUploading"
            :disabled="!selectedFile"
          />
      </div>

      <div v-if="message" :class="['status-message', messageType]">
          <i :class="messageType === 'success' ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
          {{ message }}
      </div>
    </div>
  </div>
</template>

<script src="./MigrationUpload.js"></script>
<style lang="scss" src="./MigrationUpload.scss" scoped></style>