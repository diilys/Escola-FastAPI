let professores = [];

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

        professores = await resposta.json();
        exibirProfessores(professores);

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

function exibirProfessores(listaProfessores) {
    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (listaProfessores.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    Nenhum professor encontrado.
                </td>
            </tr>
        `;
        return;
    }

    listaProfessores.forEach(professor => {
        const linha = document.createElement("tr");
        const dataFormatada = professor.data_nascimento ? professor.data_nascimento.split("T")[0] : "-";
        const codigo = professor.id || professor.codProfessor || professor.codProf || "-";

        linha.innerHTML = `
            <td>${codigo}</td>
            <td>${professor.nome || "-"}</td>
            <td>${professor.cpf || "-"}</td>
            <td>${professor.email || "-"}</td>
            <td>${dataFormatada}</td>
            <td>${professor.telefone || "-"}</td>
            <td>${professor.cidade || "-"}</td>
        `;

        tabela.appendChild(linha);
    });
}

function filtrarProfessores() {
    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;
    const texto = textoElemento.value.toLowerCase().trim();

    const professoresFiltrados = professores.filter(professor => {
        let valor = professor[campo];
        if (campo === "codProfessor" && valor === undefined) {
            valor = professor.id || professor.codProf;
        }

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor).toLowerCase().includes(texto);
    });

    exibirProfessores(professoresFiltrados);
}

const textoFiltro = document.getElementById("textoFiltro");
if (textoFiltro) {
    textoFiltro.addEventListener("input", filtrarProfessores);
}

const campoFiltro = document.getElementById("campoFiltro");
if (campoFiltro) {
    campoFiltro.addEventListener("change", filtrarProfessores);
}

const btnLimparFiltro = document.getElementById("btnLimparFiltro");
if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", function() {
        const campoTexto = document.getElementById("textoFiltro");
        if (campoTexto) {
            campoTexto.value = "";
        }
        exibirProfessores(professores);
    });
}

carregarProfessores();