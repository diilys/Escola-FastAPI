const formulario = document.getElementById("form-aluno");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = "Cadastrando...";

        const aluno = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value,
            ra: document.getElementById("ra").value,
            cidade: document.getElementById("cidade").value
        };

        try {
            const resposta = await fetch("/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(aluno)
            });

            let resultado = {};
            const contentType = resposta.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                resultado = await resposta.json();
            }

            if (resposta.ok) {
                mensagem.textContent = "Aluno cadastrado com sucesso!";
                formulario.reset();
                console.log("Aluno cadastrado:", resultado);
                
                // Recarrega a tabela caso ela exista na mesma página
                carregarAlunos();
            } else {
                const detalheErro = obterMensagemErro(resultado);
                mensagem.textContent = "Erro ao cadastrar aluno: " + detalheErro;
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
                    ra: "RA inválido.",
                    cidade: "Cidade inválida."
                };

                return mensagens[campo] || `Campo '${campo}': ${erro.msg}`;
            })
            .join(" | ");
    }

    return JSON.stringify(resultado.detail);
}



async function carregarAlunos() {
    const tabela = document.getElementById("listaAlunos");

    // Interrompe se o elemento não existir na página
    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/alunos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar alunos.");
        }

        const alunos = await resposta.json();

        tabela.innerHTML = "";

        if (alunos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        alunos.forEach(aluno => {
            const linha = document.createElement("tr");

            // Trata exibição da data para formato ISO YYYY-MM-DD simples
            const dataFormatada = aluno.data_nascimento ? aluno.data_nascimento.split("T")[0] : "-";

            linha.innerHTML = `
                <td>${aluno.id || aluno.codAluno || "-"}</td>
                <td>${aluno.nome || "-"}</td>
                <td>${aluno.cpf || "-"}</td>
                <td>${aluno.email || "-"}</td>
                <td>${dataFormatada}</td>
                <td>${aluno.telefone || "-"}</td>
                <td>${aluno.ra || "-"}</td>
                <td>${aluno.cidade || "-"}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar alunos:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">
                    Erro ao carregar os alunos.
                </td>
            </tr>
        `;
    }
}

carregarAlunos();