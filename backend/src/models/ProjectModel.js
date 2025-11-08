// ./backend/src/models/ProjectModel.js
const { internalPool } = require('../config/database');

// --- GET ALL (Lógica de Role) ---
const getAll = async (userId) => {
    let query;
    let params;

    if (userId) {
        // Usuário comum: Filtra SOMENTE pelos projetos criados por este usuário.
        query = 'SELECT id, user_id, title, completed, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
        params = [userId];
    } else {
        // Administrador: Busca TODAS as tarefas no sistema.
        query = 'SELECT id, user_id, title, completed, created_at FROM tasks ORDER BY created_at DESC';
        params = [];
    }
    
    const [projects] = await internalPool.execute(query, params); 
    return projects;
};

// --- CREATE PROJECT ---
const create = async (userId, title) => {
    const [result] = await internalPool.execute(
        'INSERT INTO tasks (user_id, title) VALUES (?, ?)',
        [userId, title]
    );
    return result.insertId;
};

// --- FIND BY ID ---
const findById = async (id, userId) => {
    // Se userId for fornecido, filtra. Senão, busca apenas por ID (uso interno do Admin).
    const query = userId 
        ? 'SELECT id, user_id, title, completed, created_at FROM tasks WHERE id = ? AND user_id = ?'
        : 'SELECT id, user_id, title, completed, created_at FROM tasks WHERE id = ?';
    
    const params = userId ? [id, userId] : [id];

    const [project] = await internalPool.execute(query, params);
    return project;
};

// --- UPDATE PROJECT ---
const update = async (id, userId, title, completed) => {
    let setClauses = [];
    let params = [];

    if (title !== undefined) {
        setClauses.push('title = ?');
        params.push(title);
    }

    if (completed !== undefined) {
        setClauses.push('completed = ?');
        params.push(completed ? 1 : 0); 
    }

    if (setClauses.length === 0) {
        return false;
    }

    params.push(id);
    params.push(userId);
    
    const query = `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await internalPool.execute(query, params);

    return result.affectedRows > 0;
};

// --- DELETE PROJECT (Usuário Comum) ---
const exclude = async (id, userId) => {
    const [result] = await internalPool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
};

// --- DELETE PROJECT (Admin) ---
const excludeAny = async (id) => {
    const [result] = await internalPool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
};


module.exports = {
    getAll,
    create,
    findById,
    update,
    exclude,
    excludeAny,
};