// backend/src/config/env.js (Atualizado)

/**
 * Arquivo central de configuração do ambiente.
 * As variáveis sensíveis são lidas de process.env.
 */
module.exports = {
    // Variáveis do Banco de Dados Interno (projeto_db)
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT || 3000,
    
    // NOVO: Variáveis do Banco de Dados Externo/Migração (consultorio_teste)
    EXTERNAL_DB_HOST: process.env.EXTERNAL_DB_HOST || process.env.DB_HOST, 
    EXTERNAL_DB_USER: process.env.EXTERNAL_DB_USER || 'root',
    EXTERNAL_DB_PASSWORD: process.env.EXTERNAL_DB_PASSWORD || process.env.DB_PASSWORD,
    EXTERNAL_DB_NAME: process.env.EXTERNAL_DB_NAME, // A ÚNICA DIFERENÇA DEVE SER O NOME DO DB
    
    // VARIÁVEIS DE SEGURANÇA (JWT)
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_para_dev_nao_usar_em_prod', 
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d' 
};