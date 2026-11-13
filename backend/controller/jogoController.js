const jogoModel = require("../model/jogoModel");
const generoModel = require("../model/generoModel");
const { removerImagem } = require("../middleware/upload");

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

// POST /api/jogos  (multipart/form-data: campos de texto + foto opcional "imagem")
async function criar(req, res) {
    const d = lerCorpo(req);
    const imagem = req.file ? req.file.filename : null;

    if (d.erro !== "") {
        removerImagem(imagem);          // a foto já foi salva pelo multer: apaga
        return res.status(400).json({ erro: d.erro });
    }

    await jogoModel.inserir(d.nome, d.plataforma, d.ano, d.nota, d.status, d.idGenero, imagem);
    res.status(201).json({ msg: "Jogo cadastrado com sucesso!" });
}

// PUT /api/jogos/:id  (foto nova é opcional: sem foto, mantém a atual)
async function atualizar(req, res) {
    const id = Number(req.params.id);
    const d = lerCorpo(req);
    const novaImagem = req.file ? req.file.filename : null;
    const atual = await jogoModel.buscar(id);

    if (!atual) {
        removerImagem(novaImagem);
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }
    if (d.erro !== "") {
        removerImagem(novaImagem);
        return res.status(400).json({ erro: d.erro });
    }

    await jogoModel.atualizar(id, d.nome, d.plataforma, d.ano, d.nota, d.status, d.idGenero, novaImagem);

    if (novaImagem) {
        removerImagem(atual.imagem);    // apaga a foto antiga
    }
    res.json({ msg: "Jogo atualizado com sucesso!" });
}

// DELETE /api/jogos/:id
async function excluir(req, res) {
    const id = Number(req.params.id);
    const jogo = await jogoModel.buscar(id);

    await jogoModel.excluir(id);
    if (jogo) {
        removerImagem(jogo.imagem);
    }
    res.json({ msg: "Jogo excluído." });
}

module.exports = { listarGeneros, listar, buscar, criar, atualizar, excluir };