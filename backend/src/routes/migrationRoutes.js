// backend/src/routes/migrationRoutes.js

const express = require('express');
const migrationController = require('../controllers/migrationController');
const authMiddleware = require('../middlewares/authMiddleware');
// Importa a função fábrica do middleware de upload
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Todas as rotas de migração devem ser autenticadas
router.use(authMiddleware);

// POST /api/migrations/upload
// Chamamos uploadMiddleware ('file') diretamente, pois ela é a função exportada.
router.post(
    '/:taskId/upload',
    uploadMiddleware('file'),
    migrationController.uploadAndParse
);

// Futuras rotas:
// router.post('/mapping', ...); // Recebe o mapeamento de colunas
// router.post('/execute/:id', ...); // Inicia o processo de atualização no DB de destino

module.exports = router;