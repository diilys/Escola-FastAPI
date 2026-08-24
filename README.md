# Sistema de Gestão Escolar
&emsp;O projeto contém os arquivos necessários para a criação de uma API REST completa, utilizando `Python, FastAPI, MySQL e JavaScript`. A estrutura do ambiente criado permite o cadastro e listagem de `alunos, professores e funcionários`.

## Tecnologias Utilizadas
* **Frontend:** HTML5, JavaScript (ES6+)
* **Backend:** Python 3 + FastAPI
* **Banco de Dados:**  MySQL
* **Servidor Web:** Uvicorn

# Configurando o Banco de Dados
~~~
CREATE DATABASE fatec;

USE fatec;

CREATE TABLE `aluno` (
  `codAluno` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `ra` varchar(10) NOT NULL,
  `cidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `aluno`
  ADD PRIMARY KEY (`codAluno`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `ra` (`ra`);


CREATE TABLE `professor` (
  `codProf` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `professor`
  ADD PRIMARY KEY (`codProf`),
  ADD UNIQUE KEY `cpf` (`cpf`);


CREATE TABLE `funcionario` (
  `codFunc` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`codFunc`),
  ADD UNIQUE KEY `cpf` (`cpf`);
~~~

# Executando o Projeto

* Clone o repositório:
~~~
git clone [https://github.com/diilys/Escola-FastAPI.git](https://github.com/diilys/Escola-FastAPI.git)
cd Escola-FastAPI
~~~

* Crie e ative o ambiente virtual:
~~~
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
~~~

* Instale as dependências:
~~~
pip install fastapi uvicorn mysql-connector-python pydantic
~~~

* Inicie o servidor backend:
~~~
uvicorn backend.main:app --reload
~~~
* Acesse a aplicação: \
Interface Web: `http://127.0.0.1:8000` \
Documentação Swagger (API): `http://127.0.0.1:8000/docs`
