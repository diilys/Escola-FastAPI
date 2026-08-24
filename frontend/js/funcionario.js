const formulario = document.getElementById("form-funcionario");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = "Cadastrando...";

        const funcionario = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value,
            cidade: document.getElementById("cidade").value
        };

        try {
            const resposta = await fetch("/funcionarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(funcionario)
            });

            let resultado = {};
            const contentType = resposta.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                resultado = await resposta.json();
            }

            if (resposta.ok) {
                mensagem.textContent = "Funcionário cadastrado com sucesso!";
                formulario.reset();
                console.log("Funcionário cadastrado com sucesso:", resultado);

                carregarFuncionarios();
            } else {
                const detalheErro = obterMensagemErro(resultado);
                mensagem.textContent = "Erro ao cadastrar funcionário: " + detalheErro;
                console.error("Erro da API:", resposta.status, resultado);
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível conectar ao servidor.";
            console.error("Erro de conexão:", erro);
        }
    });
}

function obterMensagemErro(resultado) {
    if (!resultado || !resultado.detail) {
        return "Erro interno do servidor sem detalhes.";
    }

    if (typeof resultado.detail === "string") {
        return resultado.detail;
    }

    if (Array.isArray(resultado.detail)) {
        return resultado.detail
            .map(erro => {
                const campo = erro.loc?.[erro.loc.length - 1];

                const mensagens = {
                    email: "E-mail inválido.",
                    nome: "Nome inválido.",
                    cpf: "CPF inválido.",
                    data_nascimento: "Data de nascimento inválida.",
                    telefone: "Telefone inválido.",
                    cidade: "Cidade inválida."
                };

                return mensagens[campo] || `Campo '${campo}': ${erro.msg}`;
            })
            .join(" | ");
    }

    return JSON.stringify(resultado.detail);
}



async function carregarFuncionarios() {
    const tabela = document.getElementById("listaFuncionarios");

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/funcionarios");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionários.");
        }

        const funcionarios = await resposta.json();

        tabela.innerHTML = "";

        if (funcionarios.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">
                        Nenhum funcionário cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        funcionarios.forEach(funcionario => {
            const linha = document.createElement("tr");

            const dataFormatada = funcionario.data_nascimento ? funcionario.data_nascimento.split("T")[0] : "-";

            linha.innerHTML = `
                <td>${funcionario.id || funcionario.codFunc || "-"}</td>
                <td>${funcionario.nome || "-"}</td>
                <td>${funcionario.cpf || "-"}</td>
                <td>${funcionario.email || "-"}</td>
                <td>${dataFormatada}</td>
                <td>${funcionario.telefone || "-"}</td>
                <td>${funcionario.cidade || "-"}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar funcionários:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    Erro ao carregar os funcionários.
                </td>
            </tr>
        `;
    }
}


carregarFuncionarios();