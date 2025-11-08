// backend/src/controllers/MigrationController.js
const fs = require('fs');
const path = require('path');

/**
 * Rota: POST /api/migrations/upload
 * Responsável por receber o arquivo da planilha e retornar seus metadados.
 */
const uploadAndParse = async (req, res) => {
    // 1. Verifica se o arquivo foi processado com sucesso pelo Multer
    if (!req.file) {
        // Isso não deve acontecer se o uploadMiddleware for bem-sucedido, mas é um bom fallback
        return res.status(400).json({ error: { message: 'Nenhum arquivo de planilha foi enviado ou o upload falhou.' } });
    }

    const { filename, path: filepath, originalname, mimetype, size } = req.file;
    
    // Log para verificação (aparecerá nos logs do Docker)
    console.log('✅ Arquivo de migração recebido com sucesso:');
    console.log(`- Nome Original: ${originalname}`);
    console.log(`- Nome Salvo: ${filename}`);
    console.log(`- Caminho Local: ${filepath}`);
    console.log(`- Tipo MIME: ${mimetype}`);
    
    try {
        // --- TODO: LÓGICA DE PARSING E LEITURA DA PLANILHA SERÁ IMPLEMENTADA AQUI ---
        // Nesta fase, estamos apenas confirmando o upload.

        // Retorna uma resposta de sucesso com as informações do arquivo para o Frontend
        return res.status(200).json({
            message: 'Upload da planilha realizado com sucesso. Pronto para a próxima etapa.',
            file: {
                tempId: filename, // ID temporário para referenciar o arquivo salvo
                name: originalname,
                type: mimetype,
                size: size,
                path: filepath // NÃO enviar o path real em produção. Aqui é apenas para debug/dev.
            }
        });

    } catch (error) {
        // Se a leitura falhar, pode ser útil tentar remover o arquivo temporário
        fs.unlink(filepath, (err) => {
            if (err) console.error("Aviso: Falha ao deletar arquivo temporário:", err);
        });
        
        console.error("Erro interno ao processar o arquivo de upload:", error);
        return res.status(500).json({ error: { message: 'Erro interno ao processar a planilha.' } });
    }
};

module.exports = {
    uploadAndParse,
};