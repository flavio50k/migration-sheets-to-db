// ./backend/src/controllers/taskController.js

const taskModel = require('../models/TaskModel');

// --- GET ALL (Lógica de Role e Filtro de Status) ---
const getAll = async (req, res) => {
    const { id: userId, role } = req.user;
    const { status } = req.query; 

    let tasks;

    if (role === 'admin') {
        tasks = await taskModel.getAll(null, status);
    } else {
        tasks = await taskModel.getAll(userId, status); 
    }

    return res.status(200).json(tasks);
};

// --- CREATE TASK ---
const create = async (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: { message: 'O título da tarefa é obrigatório.' } });
    }

    const taskId = await taskModel.create(userId, title);

    // Retorna a tarefa recém-criada
    const [newTask] = await taskModel.findById(taskId, userId);

    return res.status(201).json(newTask);
};

// --- UPDATE TASK ---
const update = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, completed } = req.body;

    const updated = await taskModel.update(id, userId, title, completed);

    if (updated) {
        const [updatedTaks] = await taskModel.findById(id, userId);
        return res.status(200).json(updatedTaks);
    } else {
        return res.status(404).json({ error: { message: 'Tarefa não encontrada ou não pertence ao usuário.' } });
    }
};

// --- DELETE TASK ---
const exclude = async (req, res) => {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let deleted = false;

    if (role === 'admin') {
        deleted = await taskModel.excludeAny(id);
    } else {
        deleted = await taskModel.exclude(id, userId);
    }

    if (deleted) {
        return res.status(204).send();
    } else if (role !== 'admin') {
        return res.status(403).json({ error: { message: 'Você não tem permissão para excluir esta tarefa.' } });
    } else {
        return res.status(404).json({ error: { message: 'Tarefa não encontrada.' } });
    }
};

module.exports = {
    getAll,
    create,
    update,
    exclude,
};