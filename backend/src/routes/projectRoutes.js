// taskRoutes.js (CORRIGIDO)

const express = require('express');
const projectController = require('../controllers/projectController');
const { validateBody } = require('../middlewares/projectValidation');
const authMiddleware = require('../middlewares/authMiddleware'); 

// 1. Cria a instância do roteador
const router = express.Router();

// 2. Aplica o middleware de autenticação a todas as rotas de tarefa
router.use(authMiddleware);

// 3. Define as rotas usando o router (agora protegidas)
// READ - GET /tasks
router.get('/', projectController.getAll); 

// CREATE - POST /tasks (CORRIGIDO: Usando 'create' em vez de 'createTask')
router.post('/', validateBody, projectController.create); 

// DELETE - DELETE /tasks/:id (CORRIGIDO: Usando 'exclude' em vez de 'deleteTask')
router.delete('/:id', projectController.exclude);

// UPDATE - PUT /tasks/:id (CORRIGIDO: Usando 'update' em vez de 'updateTask')
router.put('/:id', validateBody, projectController.update);

// 4. Exporta o roteador para ser usado no server.js
module.exports = router;