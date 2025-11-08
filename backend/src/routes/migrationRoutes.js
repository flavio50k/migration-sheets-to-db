// backend/src/routes/migrationRoutes.js (CORRIGIDO)

const express = require('express');
const migrationController = require('../controllers/MigrationController');
const authMiddleware = require('../middlewares/authMiddleware');
// Importa a função fábrica do middleware de upload
const uploadMiddleware = require('../middlewares/uploadMiddleware'); 

const router = express.Router();

// Todas as rotas de migração devem ser autenticadas
router.use(authMiddleware);

// POST /api/migrations/upload
// CORREÇÃO: Chamamos uploadMiddleware com o nome do campo ('file') para obter
// o middleware real que o Express deve executar.
router.post(
    '/upload', 
    uploadMiddleware('file'), // O nome do campo no FormData do Frontend deve ser 'file'
    migrationController.uploadAndParse
);

// Futuras rotas:
// router.post('/mapping', ...); // Recebe o mapeamento de colunas
// router.post('/execute/:id', ...); // Inicia o processo de atualização no DB de destino

module.exports = router;