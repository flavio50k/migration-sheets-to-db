-- 01-create-external-db.sql
-- Criado automaticamente pelo entrypoint do MySQL
CREATE DATABASE IF NOT EXISTS consultorio_teste;

-- Usa o banco de dados recém-criado
USE consultorio_teste;

-- Tabela de Migração de Pacientes (Patients)
-- Nomes das colunas mantidos exatamente como especificado, usando aspas (backticks)
-- para suportar espaços e acentos nos nomes (apesar de não ser uma boa prática em SQL,
-- estamos seguindo a sua especificação estrita).

CREATE TABLE IF NOT EXISTS `Patients` (
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL,
    `E-mail` VARCHAR(100),
    `Telefone` VARCHAR(20),
    `Data de nascimento` DATE,
    `Sexo` VARCHAR(10),
    `Estado civil` VARCHAR(50),
    `Profissão` VARCHAR(100),
    `CPF` VARCHAR(14) UNIQUE,
    `CNPJ` VARCHAR(18) UNIQUE,
    `CNH` VARCHAR(20),
    `RG` VARCHAR(20),
    `Outro documento` VARCHAR(100),
    `Origem` VARCHAR(100),
    `Observações` TEXT,
    `CEP` VARCHAR(10),
    `Endereco` VARCHAR(255),
    `Numero` VARCHAR(10),
    `Complemento` VARCHAR(100),
    `Bairro` VARCHAR(100),
    `Cidade` VARCHAR(100),
    `Estado` VARCHAR(2), -- Usado para a sigla (UF)
    `Pais` VARCHAR(50),
    
    -- Colunas de controle de migração (adicionadas para rastreamento)
    `migracao_data` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `migracao_status` VARCHAR(20) DEFAULT 'aguardando'
);

-- Tabela de Migração de Profissionais (Professionals)
CREATE TABLE IF NOT EXISTS Professionals (
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `old_id` INT,
    `active` BOOLEAN DEFAULT TRUE,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `sex` VARCHAR(10),
    `annotation` TEXT,
    `date_birth` DATE,
    `marital_status` VARCHAR(50),
    `phone` VARCHAR(20),
    `Deleted` BOOLEAN DEFAULT FALSE, -- Soft Delete
    `migracao_data` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Migração de Procedimentos (Procedures)
CREATE TABLE IF NOT EXISTS Procedures (
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `procedures` VARCHAR(255) NOT NULL,
    `procedure_duration` INT, -- Duração em minutos
    `procedure_amount` DECIMAL(10, 2), -- Valor monetário
    `procedure_active` BOOLEAN DEFAULT TRUE,
    `migracao_data` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Migração de Consultas (Consultations)
CREATE TABLE IF NOT EXISTS Consultations (
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `deleted` BOOLEAN DEFAULT FALSE,
    `patient_id` INT, -- ID do paciente na nova DB
    `patient_name` VARCHAR(255),
    `professional_id` INT, -- ID do profissional na nova DB
    `professional_name` VARCHAR(255),
    `date` DATE,
    `time_start` TIME,
    `time_end` TIME,
    `notes` TEXT,
    `procedures` TEXT, -- Lista denormalizada de procedimentos/IDs (migração)
    `procedure_duration` INT,
    `procedure_amount` DECIMAL(10, 2),
    `procedure_active` BOOLEAN DEFAULT TRUE,
    `status` VARCHAR(50),
    `migracao_data` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Migração de Agendamentos (Appointments)
CREATE TABLE IF NOT EXISTS Appointments (
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `deleted` BOOLEAN DEFAULT FALSE,
    `type` VARCHAR(50),
    `notes` TEXT,
    `patient_id` INT,
    `patient_name` VARCHAR(255),
    `professional_id` INT,
    `professional_name` VARCHAR(255),
    `started_at` DATETIME,
    `finished_at` DATETIME,
    `duration` INT,
    `migracao_data` DATETIME DEFAULT CURRENT_TIMESTAMP
);