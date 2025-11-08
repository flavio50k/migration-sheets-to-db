// backend/src/middlewares/uploadMiddleware.js (ATUALIZADO PARA MULTER 2.x)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que o diretório de uploads exista
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 1. Configuração de Armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Salva no diretório 'backend/uploads'
    },
    filename: (req, file, cb) => {
        // Cria um nome de arquivo único: user_id-timestamp-original_name
        const userId = req.user.id || 'anonymous'; 
        const timestamp = Date.now();
        // A função file.originalname pode precisar ser sanitizada mais agressivamente se for um risco
        const safeFilename = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        
        const uniqueFilename = `${userId}-${timestamp}-${safeFilename}`; 
        cb(null, uniqueFilename);
    }
});

// 2. Filtro de Arquivos (Apenas planilhas)
const fileFilter = (req, file, cb) => {
    // Mime types comuns para CSV, XLS, XLSX, ODS
    const allowedTypes = [
        'text/csv', 
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.oasis.opendocument.spreadsheet' // .ods
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceita o arquivo
    } else {
        // Cria um erro de validação para o Multer
        const error = new Error('Formato de arquivo inválido. Apenas planilhas (CSV, XLS, XLSX, ODS) são permitidas.');
        error.code = 'INVALID_MIME_TYPE';
        cb(error, false); 
    }
};

// 3. Cria a instância do Multer 2.x
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 } // Limite de 50MB
});

// 4. Wrapper para upload.single
// Usamos o 'upload.single' diretamente aqui, pois a Multer 2.x tem melhor tratamento de erros
// quando é chamada por um middleware Express (via express-async-errors)
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        // Envolve a chamada do Multer em uma Promise para melhor tratamento assíncrono
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                // Trata erros de limite (LIMIT_FILE_SIZE, etc) ou do fileFilter
                let message = err.message;
                let status = 400;

                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'Arquivo muito grande. O limite é de 50MB.';
                } else if (err.code === 'INVALID_MIME_TYPE') {
                    message = err.message; // Mensagem customizada do fileFilter
                } else if (err instanceof multer.MulterError) {
                    message = `Erro no upload do Multer: ${err.message}`;
                } else {
                    status = 500; // Erro interno não esperado
                }
                
                return res.status(status).json({ error: { message } });
            }
            // Se tudo correr bem, passa para o próximo middleware/controller
            next();
        });
    }
};

// Exporta a função que recebe o nome do campo (ex: 'file')
module.exports = uploadSingle;