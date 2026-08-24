const formulario = document.getElementById("form-aluno");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = "";

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

            const resultado = await resposta.json();

            if (resposta.ok) {
                mensagem.textContent = "Aluno cadastrado com sucesso!";
                formulario.reset();
                console.log("Aluno cadastrado:", resultado);
            } else {
                mensagem.textContent = "Erro ao cadastrar aluno: " + obterMensagemErro(resultado);
                console.error("Erro da API:", resultado);
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível conectar ao servidor.";
            console.error("Erro de conexão:", erro);
        }
    });
}

function obterMensagemErro(resultado) {
    if (!resultado.detail) {
        return "Dados inválidos.";
    }

    if (Array.isArray(resultado.detail)) {
        return resultado.detail
            .map(erro => {
                const campo = erro.loc?.[1];

                const mensagens = {
                    email: "E-mail inválido.",
                    nome: "Nome inválido.",
                    cpf: "CPF inválido.",
                    data_nascimento: "Data de nascimento inválida.",
                    telefone: "Telefone inválido.",
                    ra: "RA inválido.",
                    cidade: "Cidade inválida."
                };

                return mensagens[campo] || erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}