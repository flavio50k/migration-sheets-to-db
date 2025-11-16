// backend/src/routes/taskRoutes.js

const express = require('express');
const taskController = require('../controllers/taskController');
const { validateBody } = require('../middlewares/taskValidation');
const authMiddleware = require('../middlewares/authMiddleware'); 

// 1. Cria a instância do roteador
const router = express.Router();

// 2. Aplica o middleware de autenticação a todas as rotas de tarefa
router.use(authMiddleware);

// 3. Define as rotas usando o router
// READ - GET /tasks
router.get('/', taskController.getAll); 

// READ ONE - GET /tasks/:id
router.get('/:id', taskController.getById);

// CREATE - POST /tasks
router.post('/', validateBody, taskController.create); 

// DELETE - DELETE /tasks/:id
router.delete('/:id', taskController.exclude);

// UPDATE - PUT /tasks/:id/complete & /tasks/:id
// 1º: Rota Específica (Completar Tarefa)
router.put('/:id/complete', taskController.update);

// 2º: Rota Genérica (Editar Título/Outros dados)
router.put('/:id', validateBody, taskController.update);

// 4. Exporta o roteador para ser usado no server.js
module.exports = router;