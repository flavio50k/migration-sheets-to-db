// ./backend/src/models/TaskModel.js
const { internalPool } = require('../config/database');

// --- GET ALL (Com Filtro de Status) ---

/**
 * Busca todas as tarefas, opcionalmente filtrando por usuário e status.
 * @param {number|null} userId - ID do usuário (null para admin).
 * @param {string} status - 'open', 'completed' ou undefined/null para 'all'.
 * @returns {Array} Lista de tarefas.
 */

const getAll = async (userId, status) => {
    let query = 'SELECT id, user_id, title, completed, created_at FROM tasks';
    const params = [];
    const conditions = [];

    // 1. Filtro por Usuário
    if (userId) {
        conditions.push('user_id = ?');
        params.push(userId);
    }

    // 2. Filtro por Status
    // 'open' = completed = 0 | 'completed' = completed = 1
    if (status === 'open') {
        conditions.push('completed = 0');
    } else if (status === 'completed') {
        conditions.push('completed = 1');
    }

    // 3. Monta a cláusula WHERE
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    // Executa a consulta
    const [tasks] = await internalPool.execute(query, params);
    return tasks;
};

// --- CREATE TASK ---
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

    const [task] = await internalPool.execute(query, params);
    return task;
};

// --- UPDATE TASK ---
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

// --- DELETE TASK (Usuário Comum) ---
const exclude = async (id, userId) => {
    const [result] = await internalPool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
};

// --- DELETE TASK (Admin) ---
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