const jogoModel = require("../model/jogoModel");
const compraModel = require("../model/compraModel");
const statusModel = require("../model/statusModel");

const statusPermitidos = ["Quero jogar", "Jogando", "Zerado"];
// Estes dois só podem ser escolhidos por quem já comprou o jogo.
const statusQueExigemCompra = ["Jogando", "Zerado"];

// GET /api/loja/:id  ->  dados do jogo + se o usuário comprou + status dele
async function detalhe(req, res) {
    const idJogo = Number(req.params.id);
    const idUsuario = req.session.usuario.id;

    const jogo = await jogoModel.buscarDetalhe(idJogo);
    if (!jogo) {
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    const comprado = await compraModel.jaComprou(idUsuario, idJogo);
    const status = await statusModel.buscar(idUsuario, idJogo);

    res.json({ jogo, comprado, status });
}

// PUT /api/loja/:id/status  ->  o usuário marca o jogo como Quero jogar, Jogando ou Zerado
async function definirStatus(req, res) {
    const idJogo = Number(req.params.id);
    const idUsuario = req.session.usuario.id;
    const status = req.body.status;

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido." });
    }

    const jogo = await jogoModel.buscar(idJogo);
    if (!jogo) {
        return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    // Regra: Jogando e Zerado só depois da compra (a API garante, mesmo que alguém burle a tela).
    if (statusQueExigemCompra.includes(status)) {
        const comprado = await compraModel.jaComprou(idUsuario, idJogo);
        if (!comprado) {
            return res.status(403).json({ erro: "Compre o jogo para marcá-lo como Jogando ou Zerado." });
        }
    }

    await statusModel.salvar(idUsuario, idJogo, status);
    res.json({ msg: "Status atualizado: " + status, status });
}

module.exports = { detalhe, definirStatus };