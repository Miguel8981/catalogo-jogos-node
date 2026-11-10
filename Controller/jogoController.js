const jogoModel = require("../model/jogoModel");
const generoModel = require("../model/generoModel");

const statusLista = ["Quero jogar", "Jogando", "Zerado"];

// Valores padrão do formulário de um jogo novo.
const jogoVazio = {
    id: 0,
    nome: "",
    plataforma: "",
    ano_lancamento: "",
    nota: "",
    status: "Quero jogar",
    id_genero: 0
};

// GET /jogos  ->  lista os jogos (com filtro opcional ?genero=)
async function listar(req, res) {
    const idGenero = Number(req.query.genero) || 0;

    const generos = await generoModel.listar();
    const jogos = await jogoModel.listar(idGenero);

    res.render("visu_jogos", {
        jogos: jogos,
        generos: generos,
        idGenero: idGenero,
        msg: req.query.msg || ""
    });
}

// GET /jogos/novo  ->  formulário vazio
async function formNovo(req, res) {
    const generos = await generoModel.listar();

    res.render("cad_jogo", {
        jogo: jogoVazio,
        generos: generos,
        statusLista: statusLista,
        erro: req.query.erro || ""
    });
}

// GET /jogos/:id/editar  ->  formulário preenchido com o jogo do banco
async function formEditar(req, res) {
    const jogo = await jogoModel.buscar(Number(req.params.id));

    if (!jogo) {
        return res.redirect("/jogos");
    }

    const generos = await generoModel.listar();

    res.render("cad_jogo", {
        jogo: jogo,
        generos: generos,
        statusLista: statusLista,
        erro: req.query.erro || ""
    });
}

// Devolve o texto do erro, ou "" se estiver tudo certo.
function validar(nome, plataforma, idGenero, ano, nota, status) {
    if (nome === "" || plataforma === "" || !(idGenero > 0)) {
        return "Preencha nome, plataforma e gênero.";
    }
    if (!(ano >= 1950 && ano <= new Date().getFullYear() + 1)) {
        return "Ano de lançamento inválido.";
    }
    if (!(nota >= 0 && nota <= 10)) {
        return "A nota deve estar entre 0 e 10.";
    }
    if (!statusLista.includes(status)) {
        return "Status inválido.";
    }
    return "";
}

// POST /jogos/salvar  ->  cadastra (id = 0) ou atualiza (id > 0)
async function salvar(req, res) {
    const id = Number(req.body.id) || 0;
    const nome = (req.body.nome || "").trim();
    const plataforma = (req.body.plataforma || "").trim();
    const ano = Number(req.body.ano_lancamento);
    const nota = Number(req.body.nota);
    const status = req.body.status;
    const idGenero = Number(req.body.id_genero);

    const erro = validar(nome, plataforma, idGenero, ano, nota, status);

    if (erro !== "") {
        const voltar = id > 0 ? "/jogos/" + id + "/editar" : "/jogos/novo";
        return res.redirect(voltar + "?erro=" + encodeURIComponent(erro));
    }

    if (id > 0) {
        await jogoModel.atualizar(id, nome, plataforma, ano, nota, status, idGenero);
        res.redirect("/jogos?msg=" + encodeURIComponent("Jogo atualizado com sucesso!"));
    } else {
        await jogoModel.inserir(nome, plataforma, ano, nota, status, idGenero);
        res.redirect("/jogos?msg=" + encodeURIComponent("Jogo cadastrado com sucesso!"));
    }
}

// POST /jogos/:id/excluir
async function excluir(req, res) {
    await jogoModel.excluir(Number(req.params.id));
    res.redirect("/jogos?msg=" + encodeURIComponent("Jogo excluído."));
}

module.exports = { listar, formNovo, formEditar, salvar, excluir };
