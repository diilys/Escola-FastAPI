const formulario = document.getElementById("form-professor");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = "Cadastrando...";

        const professor = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value,
            cidade: document.getElementById("cidade").value
        };

        try {
            const resposta = await fetch("/professores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(professor)
            });

            let resultado = {};
            const contentType = resposta.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                resultado = await resposta.json();
            }

            if (resposta.ok) {
                mensagem.textContent = "Professor cadastrado com sucesso!";
                formulario.reset();
                console.log("Professor cadastrado com sucesso:", resultado);

                carregarProfessores();
            } else {
                const detalheErro = obterMensagemErro(resultado);
                mensagem.textContent = "Erro ao cadastrar professor: " + detalheErro;
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



async function carregarProfessores() {
    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/professores");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar professores.");
        }

        const professores = await resposta.json();

        tabela.innerHTML = "";

        if (professores.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">
                        Nenhum professor cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        professores.forEach(professor => {
            const linha = document.createElement("tr");

            const dataFormatada = professor.data_nascimento ? professor.data_nascimento.split("T")[0] : "-";

            linha.innerHTML = `
                <td>${professor.id || professor.codProf || "-"}</td>
                <td>${professor.nome || "-"}</td>
                <td>${professor.cpf || "-"}</td>
                <td>${professor.email || "-"}</td>
                <td>${dataFormatada}</td>
                <td>${professor.telefone || "-"}</td>
                <td>${professor.cidade || "-"}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar professores:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    Erro ao carregar os professores.
                </td>
            </tr>
        `;
    }
}


carregarProfessores();