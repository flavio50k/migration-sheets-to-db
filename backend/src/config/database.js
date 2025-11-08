// ./backend/src/config/database.js (CORRIGIDO E ATUALIZADO)
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const env = require('./env'); 

// --- 1. CONFIGURAÇÕES DAS POOLS ---

// Pool Interno (projeto_db): Para as operações normais do backend (users, projects)
const internalDbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
const internalPool = mysql.createPool(internalDbConfig);

// Pool Externo (consultorio_teste): Para a leitura dos dados de migração
const externalDbConfig = {
    host: env.EXTERNAL_DB_HOST,
    user: env.EXTERNAL_DB_USER,
    password: env.EXTERNAL_DB_PASSWORD,
    database: env.EXTERNAL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 5, // Uma pool menor, pois o uso é intermitente
    queueLimit: 0
};
const externalPool = mysql.createPool(externalDbConfig);

const saltRounds = 10; 
// O usuário admin padrão é definido aqui
const adminUsername = 'admin'; 
const adminPassword = 'admin'; // Senha de desenvolvimento

// --- 2. FUNÇÕES DE CRIAÇÃO/VERIFICAÇÃO DE TABELAS ---

async function ensureTablesExist(pool) {
    // 1. Tabela de Usuários (somente no DB principal: internalPool)
    if (pool === internalPool) {
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.execute(createUsersTableQuery);
        console.log("Tabela 'users' verificada/criada.");

        // 2. Tabela de Projetos (Antigas Tasks)
        const createTasksTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.execute(createTasksTableQuery);
        console.log("Tabela 'tasks' (Projetos) verificada/criada.");

        // 💥 NOVO: 3. Tabela de Migrações
        const createMigrationsTableQuery = `
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                file_name VARCHAR(255) NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('PENDING', 'PROCESSED', 'FAILED') DEFAULT 'PENDING',
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `;
        await pool.execute(createMigrationsTableQuery);
        console.log("Tabela 'migrations' verificada/criada.");
        
        // 4. Cria o usuário Admin padrão
        await createDefaultAdmin(internalPool);
    }
}

async function createDefaultAdmin(pool) {
    try {
        const [users] = await pool.execute('SELECT id FROM users WHERE username = ?', [adminUsername]);
        if (users.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
            await pool.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [adminUsername, hashedPassword, 'admin']
            );
            console.log(`Usuário Admin padrão (${adminUsername}) criado com sucesso.`);
        }
    } catch (error) {
        console.error("Aviso: Falha ao tentar criar usuário Admin padrão. Se for a primeira inicialização, ignore:", error.message);
    }
}

// --- 3. FUNÇÃO DE INICIALIZAÇÃO (Retry com Múltiplas Pools) ---

async function checkConnection(poolName, pool) {
    // Tenta executar uma query simples para verificar a conexão
    await pool.execute('SELECT 1 + 1');
    console.log(`✅ Conexão com ${poolName} verificada com sucesso.`);
}


async function initializeDatabase() {
    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 3000; 
    console.log('Iniciando conexão com o MySQL...');

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // 1. Testa a conexão da Pool Interna (projeto_db)
            await checkConnection('DB Principal (projeto_db)', internalPool);
            
            // 2. Cria/Verifica tabelas (APENAS no DB Principal)
            await ensureTablesExist(internalPool);
            
            // 3. Testa a conexão da Pool Externa (consultorio_teste)
            // Esta conexão não cria tabelas, apenas verifica se o DB de origem existe.
            if (env.EXTERNAL_DB_NAME) { // Só tenta se a variável estiver definida
                await checkConnection(`DB Externo (${env.EXTERNAL_DB_NAME})`, externalPool);
            }

            return; // Sucesso: Sai do loop
        } catch (err) {
            console.error(`Falha na conexão ou inicialização (Tentativa ${i + 1}/${MAX_RETRIES}):`);
            // Se o erro for de conexão, tentamos novamente
            if (i === MAX_RETRIES - 1) {
                console.error("Falha na inicialização do DB após várias tentativas. Encerrando.");
                // O erro original
                throw new Error("Erro Crítico: Não foi possível conectar a um dos bancos de dados.");
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}

// Chamada de inicialização
initializeDatabase();

// --- 4. EXPORTAÇÕES ---
module.exports = {
    // Exportamos ambas as pools
    internalPool, // Pool para 'users' e 'tasks' (seu projeto)
    externalPool  // Pool para 'consultorio_teste' (sua fonte de dados)
};