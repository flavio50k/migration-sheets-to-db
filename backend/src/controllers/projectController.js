// ./backend/src/controllers/projectController.js
// IMPORTAÇÃO CORRIGIDA: Usa ProjectModel
const projectModel = require('../models/ProjectModel'); 

// --- GET ALL (Lógica de Role) ---
const getAll = async (req, res) => {
    const { id: userId, role } = req.user; 
    
    let projects;

    if (role === 'admin') {
        projects = await projectModel.getAll(null); 
    } else {
        projects = await projectModel.getAll(userId);
    }
    
    return res.status(200).json(projects);
};

// --- CREATE PROJECT ---
const create = async (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: { message: 'O título do projeto é obrigatório.' } });
    }

    const projectId = await projectModel.create(userId, title); 
    
    // Retorna o projeto recém-criado 
    const [newProject] = await projectModel.findById(projectId, userId);

    return res.status(201).json(newProject);
};

// --- UPDATE PROJECT ---
const update = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, completed } = req.body; 

    const updated = await projectModel.update(id, userId, title, completed);

    if (updated) {
        const [updatedProject] = await projectModel.findById(id, userId);
        return res.status(200).json(updatedProject);
    } else {
        return res.status(404).json({ error: { message: 'Projeto não encontrado ou não pertence ao usuário.' } });
    }
};

// --- DELETE PROJECT ---
const exclude = async (req, res) => {
    const { id } = req.params;
    const { role, id: userId } = req.user; 

    let deleted = false;

    if (role === 'admin') {
        deleted = await projectModel.excludeAny(id);
    } else {
        deleted = await projectModel.exclude(id, userId);
    }

    if (deleted) {
        return res.status(204).send(); 
    } else if (role !== 'admin') {
        return res.status(403).json({ error: { message: 'Você não tem permissão para excluir este projeto.' } });
    } else {
        return res.status(404).json({ error: { message: 'Projeto não encontrado.' } });
    }
};

module.exports = {
    getAll,
    create,
    update,
    exclude,
};