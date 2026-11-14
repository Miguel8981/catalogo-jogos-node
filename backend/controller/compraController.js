const compraModel = require("../model/compraModel");
const jogoModel = require("../model/jogoModel");

// GET /api/compras  ->  ids dos jogos que o usuário já adicionou à biblioteca
async function listar(req, res) {
    const ids = await compraModel.listarIdsDoUsuario(req.session.usuario.id);
    res.json(ids);
}

// POST /api/compras/:idJogo  ->  adiciona um jogo à biblioteca do usuário
async function comprar(req, res) {
    const idJogo = Number(req.params.idJogo);
    const jogo = await jogoModel.buscar(idJogo);

    if (!jogo) {
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    await compraModel.comprar(req.session.usuario.id, idJogo);
    res.status(201).json({ msg: "Jogo adicionado à sua biblioteca: " + jogo.nome });
}

// GET /api/biblioteca  ->  a biblioteca do usuário: jogos adicionados + status dele em cada um
async function biblioteca(req, res) {
    const jogos = await compraModel.listarBiblioteca(req.session.usuario.id);
    res.json(jogos);
}

module.exports = { listar, comprar, biblioteca };