# 🚀 Projeto Fullstack de Migração de Dados com Docker Compose
## Node.js + Vue.js + MySQL + PrimeVue

Este projeto Fullstack é um sistema de gestão de tarefas focado na **Migração de Dados** de planilhas (`.xlsx`, `.csv`) para um banco de dados de destino (`consultorio_teste`).

A solução é totalmente containerizada com **Docker Compose**, unindo **Node.js (Express)** no backend, **Vue.js 3** com o framework **PrimeVue** para uma interface moderna, e **MySQL 8.0** para persistência e armazenamento dos dados de migração.

---

## 🎯 Funcionalidades e Regras de Negócio

1.  **Controle de Acesso:** Usuários e Administradores (Admin).
2.  **Gestão de Tarefas:** Usuários podem criar e completar suas próprias tarefas.
3.  **Permissões de Admin:**
    * **Exclusão:** Apenas Administradores podem excluir qualquer tarefa.
    * **Visualização/Edição:** Administradores podem visualizar detalhes e atualizar **todas** as tarefas do sistema (Regra implementada no `taskController`).
4.  **Fluxo de Migração:** Cada tarefa permite o **Upload de uma Planilha**, registrando o arquivo e metadados no DB para posterior processamento e inserção no banco de destino.

---

## 🧱 Arquitetura de Contêineres

| Serviço | Tecnologia | Porta Host | Descrição |
| :--- | :--- | :--- | :--- |
| **backend** | Node.js + Express | `3000` | API REST, Autenticação, Regras de Negócio e Lógica de Upload. |
| **frontend** | Vue.js 3 + Nginx | `8080` | Interface do usuário moderna, construída com PrimeVue. |
| **db** | MySQL 8.0 | `3306` | Banco de dados principal (`projeto_db`) e de destino (`consultorio_teste`). |
| **phpmyadmin** | phpMyAdmin | `8081` | Ferramenta web para gerenciamento visual do MySQL. |

---

## ⚙️ Tecnologias Utilizadas

### 🖥️ Frontend (Vue.js 3)
* **PrimeVue:** Biblioteca de componentes UI para layout profissional e moderno.
* **Axios:** Cliente HTTP para comunicação com a API.
* **Vue Router:** Gerenciamento de rotas e Guardas de Autenticação.

### 💻 Backend (Node.js + Express)
* **JWT:** Autenticação segura.
* **RBAC:** Controle de permissões (user/admin).
* **Multer:** Middleware para tratamento de upload de arquivos.
* **MySQL2/Promise:** Conexão otimizada para o banco de dados.

### 🗄️ Banco de Dados
- **MySQL 8.0** — persistência de dados confiável
- **phpMyAdmin** — interface de administração SQL

---

## 🧠 Rotas da API (API REST Endpoints)

| Método | Rota | Descrição | Permissão |
| :--- | :--- | :--- | :--- |
| **POST** | `/users/register` | Cria um novo usuário (`role: user`). | Pública |
| **POST** | `/users/login` | Login, retorna JWT (`token`). | Pública |
| **GET** | `/tasks` | Lista tarefas (todas para Admin, próprias para User). | user/admin |
| **GET** | `/tasks/:id` | **Detalhe da Tarefa** (necessário para o Upload). | user/admin |
| **POST** | `/tasks` | Cria uma nova tarefa. | user/admin |
| **PUT** | `/tasks/:id` | Atualiza título/dados. | Admin (Qualquer) / User (Própria) |
| **PUT** | `/tasks/:id/complete` | **Marca/Desmarca** tarefa como concluída. | Admin (Qualquer) / User (Própria) |
| **DELETE** | `/tasks/:id` | Exclui tarefa. | **Admin (Único)** |
| **POST** | `/migrations/:taskId/upload` | Recebe a planilha (`multipart/form-data`) e cria o registro de migração. | user/admin |

---

## 🛠️ Instalação e Execução (Docker)

Certifique-se de que o Docker e o Docker Compose estejam instalados.

1.  **Variáveis de Ambiente:** Crie o arquivo `.env` na raiz do projeto com base no `.env.example`.
2.  **Build & Run:** O comando abaixo irá construir todas as imagens (incluindo a instalação do **PrimeVue**) e inicializar os serviços.

### 🐳 Construa e inicie os containers
```bash
# Inicializa todos os containers (Backend, Frontend, DB, PhpMyAdmin)
docker-compose up --build -d
```

---

## 🐳 Como Executar o Projeto

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/flavio50k/projeto-fullstack.git
cd projeto-fullstack
```

### 🐳 Como Executar o Projeto

#### 2️⃣ Crie o arquivo `.env` na raiz (baseado em `.env.example`)
```bash
# Variáveis de ambiente
MYSQL_ROOT_PASSWORD=sua_senha_root_aqui
MYSQL_DATABASE=projeto_db

JWT_SECRET=uma_chave_secreta_muito_longa_e_aleatoria_para_proteger_os_tokens_em_producao
JWT_EXPIRES_IN=1d
```

### 🐳 Construa e inicie os containers

```bash
docker-compose up -d --build
```

### 4️⃣ Acesse os serviços

| Serviço | URL |
|---------|-----|
| 🌐 **Frontend (Vue + Nginx)** | http://localhost:8080 |
| ⚙️ **Backend (API Express)** | http://localhost:3000 |
| 🗄️ **phpMyAdmin** | http://localhost:8081 |
| 🛢️ **MySQL** | http://localhost:3306 |

---

### 👨‍💻 Autor

**Flávio Luiz Bé**  
💼 Desenvolvedor Fullstack  
📧 flavio50k@protonmail.com  
🌐 [github.com/flavio50k](https://github.com/flavio50k)
