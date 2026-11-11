const jogoModel = require("../Model/jogoModel");
const generoModel = require("../Model/generoModel");

const statusLista = ["Quero jogar", "Jogando", "Zerado"];

// GET /api/generos  ->  gêneros para o select do formulário e do filtro
async function listarGeneros(req, res) {
    res.json(await generoModel.listar());
}

// GET /api/jogos  ->  lista os jogos (com filtro opcional ?genero=)
async function listar(req, res) {
    const idGenero = Number(req.query.genero) || 0;
    res.json(await jogoModel.listar(idGenero));
}

// GET /api/jogos/:id  ->  um jogo (usado na tela de edição)
async function buscar(req, res) {
    const jogo = await jogoModel.buscar(Number(req.params.id));

    if (!jogo) {
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    res.json(jogo);
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

// Lê e valida o corpo da requisição (usado por criar e atualizar).
function lerCorpo(req) {
    const nome = (req.body.nome || "").trim();
    const plataforma = (req.body.plataforma || "").trim();
    const ano = Number(req.body.ano_lancamento);
    const nota = Number(req.body.nota);
    const status = req.body.status;
    const idGenero = Number(req.body.id_genero);

    const erro = validar(nome, plataforma, idGenero, ano, nota, status);

    return { nome, plataforma, ano, nota, status, idGenero, erro };
}

// POST /api/jogos
async function criar(req, res) {
    const d = lerCorpo(req);

    if (d.erro !== "") {
        return res.status(400).json({ erro: d.erro });
    }

    await jogoModel.inserir(d.nome, d.plataforma, d.ano, d.nota, d.status, d.idGenero);
    res.status(201).json({ msg: "Jogo cadastrado com sucesso!" });
}

// PUT /api/jogos/:id
async function atualizar(req, res) {
    const id = Number(req.params.id);
    const d = lerCorpo(req);

    if (d.erro !== "") {
        return res.status(400).json({ erro: d.erro });
    }

    await jogoModel.atualizar(id, d.nome, d.plataforma, d.ano, d.nota, d.status, d.idGenero);
    res.json({ msg: "Jogo atualizado com sucesso!" });
}

// DELETE /api/jogos/:id
async function excluir(req, res) {
    await jogoModel.excluir(Number(req.params.id));
    res.json({ msg: "Jogo excluído." });
}

module.exports = { listarGeneros, listar, buscar, criar, atualizar, excluir };