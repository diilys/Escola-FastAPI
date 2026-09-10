let alunos = [];

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
                headers: { "Content-Type": "application/json" },
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

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/alunos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar alunos.");
        }

        alunos = await resposta.json();
        exibirAlunos(alunos);

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

function exibirAlunos(listaAlunos) {
    const tabela = document.getElementById("listaAlunos");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (listaAlunos.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">
                    Nenhum aluno encontrado.
                </td>
            </tr>
        `;
        return;
    }

    listaAlunos.forEach(aluno => {
        const linha = document.createElement("tr");
        const dataFormatada = aluno.data_nascimento ? aluno.data_nascimento.split("T")[0] : "-";
        const codigo = aluno.id || aluno.codAluno || "-";

        linha.innerHTML = `
            <td>${codigo}</td>
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
}

function filtrarAlunos() {
    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;
    const texto = textoElemento.value.toLowerCase().trim();

    const alunosFiltrados = alunos.filter(aluno => {
        let valor = aluno[campo];
        if (campo === "codAluno" && valor === undefined) {
            valor = aluno.id;
        }

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor).toLowerCase().includes(texto);
    });

    exibirAlunos(alunosFiltrados);
}

const textoFiltro = document.getElementById("textoFiltro");
if (textoFiltro) {
    textoFiltro.addEventListener("input", filtrarAlunos);
}

const campoFiltro = document.getElementById("campoFiltro");
if (campoFiltro) {
    campoFiltro.addEventListener("change", filtrarAlunos);
}

const btnLimparFiltro = document.getElementById("btnLimparFiltro");
if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", function() {
        const campoTexto = document.getElementById("textoFiltro");
        if (campoTexto) {
            campoTexto.value = "";
        }
        exibirAlunos(alunos);
    });
}

carregarAlunos();