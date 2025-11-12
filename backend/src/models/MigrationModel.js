// backend/src/models/MigrationModel.js
const { internalPool } = require('../config/database'); // Usa o pool interno

/**
 * Cria um novo registro de migração após o upload do arquivo.
 * @param {number} userId - ID do usuário logado.
 * @param {number} taskId - ID da Terafa (Task) ao qual esta migração pertence.
 * @param {object} file - Objeto de arquivo retornado pelo Multer.
 * @param {string} targetDbName - Nome do DB de destino (do .env ou selecionado).
 * @returns {number} ID da nova migração.
 */
const createMigrationRecord = async (userId, taskId, file, targetDbName) => {
    const originalFilename = file.originalname;
    const storagePath = file.path; // Caminho completo no disco (ex: /app/uploads/...)

    const [result] = await internalPool.execute(
        `INSERT INTO migrations 
         (task_id, user_id, original_filename, storage_path, target_db_name, status) 
         VALUES (?, ?, ?, ?, ?, 'uploaded')`,
        [taskId, userId, originalFilename, storagePath, targetDbName]
    );

    return result.insertId;
};

// Futuras funções (getById, updateStatus, getMigrationHistory...)

module.exports = {
    createMigrationRecord,
    // ...
};