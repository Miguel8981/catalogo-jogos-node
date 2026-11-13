const compraModel = require("../model/compraModel");
const jogoModel = require("../model/jogoModel");

async function listar(req, res) {
    const ids = await compraModel.listarIdsDoUsuario(req.session.usuario.id);
    res.json(ids);
}

async function comprar(req, res) {
    const idJogo = Number(req.params.idJogo);
    const jogo = await jogoModel.buscar(idJogo);

    if (!jogo) {
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    await compraModel.comprar(req.session.usuario.id, idJogo);
    res.status(201).json({ msg: "Compra realizada: " + jogo.nome });
}

module.exports = { listar, comprar };