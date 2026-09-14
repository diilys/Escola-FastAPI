# Sistema de Gestão Escolar
&emsp;O projeto contém os arquivos necessários para a criação de uma API REST completa, utilizando `Python, FastAPI, MySQL e JavaScript`. A estrutura do ambiente criado permite o cadastro e listagem de `alunos, professores e funcionários`.

## Tecnologias Utilizadas
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Python 3 + FastAPI
* **Banco de Dados:**  MySQL
* **Servidor Web:** Uvicorn

# Configurando o Banco de Dados
* Crie o banco de dados:
~~~
CREATE DATABASE IF NOT EXISTS escola;
USE escola;

-- Tabela Aluno
CREATE TABLE `aluno` (
  `codAluno` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `ra` varchar(10) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  PRIMARY KEY (`codAluno`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `ra` (`ra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela Professor
CREATE TABLE `professor` (
  `codProf` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  PRIMARY KEY (`codProf`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela Funcionario
CREATE TABLE `funcionario` (
  `codFunc` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  PRIMARY KEY (`codFunc`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
~~~
&emsp;Execute os comandos.

* Crie o arquivo .env:
~~~
DB_HOST=localhost
DB_PORT=3306
DB_NAME=escola
DB_USER=root
DB_PASSWORD=suaSenha
~~~
&emsp;Valores exemplo.

# Executando o Projeto
* Clone o repositório:
~~~
git clone https://github.com/diilys/Escola-FastAPI.git
cd Escola-FastAPI
~~~

* Crie e ative o ambiente virtual:
~~~
# Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
~~~

* Instale as dependências:
~~~
pip install -r requirements.txt
~~~

* Inicie o servidor backend:
~~~
uvicorn backend.main:app --reload
~~~
* Acesse a aplicação: \
Interface Web: `http://127.0.0.1:8000` \
Documentação Swagger (API): `http://127.0.0.1:8000/docs`
