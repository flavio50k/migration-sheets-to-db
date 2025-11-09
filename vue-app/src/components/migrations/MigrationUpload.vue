<template>
  <div class="migration-upload-card">
    <h3>Upload de Planilha de Migração</h3>
    <p>Utilize esta seção para enviar o arquivo da planilha (ex: `.xlsx`, `.csv`) que contém os dados a serem migrados para o banco de dados **consultorio_teste**.</p>
    
    <div class="upload-area">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        style="display: none;"
      />
      
      <button 
        @click="triggerFileInput" 
        :disabled="isUploading"
        class="select-file-btn"
      >
        {{ selectedFile ? 'Arquivo Selecionado' : 'Selecionar Arquivo' }}
      </button>

      <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
    </div>

    <button 
      @click="uploadFile" 
      :disabled="!selectedFile || isUploading"
      class="upload-btn"
    >
      {{ isUploading ? 'Enviando...' : 'Fazer Upload' }}
    </button>
    
    <p v-if="message" :class="messageType === 'success' ? 'success-msg' : 'error-msg'">
      {{ message }}
    </p>

    <div v-if="migrationData" class="data-preview">
        <h4>Pré-visualização do Upload:</h4>
        <pre>{{ migrationData }}</pre>
    </div>
  </div>
</template>

<script src="./MigrationUpload.js"></script>
<style lang="scss" src="./MigrationUpload.scss" scoped></style>
