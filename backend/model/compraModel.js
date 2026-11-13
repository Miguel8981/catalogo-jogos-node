const conexao = require("./conexao")

async function listarIdsDoUsuario(idUsuario) {
    const [linhas] = await conexao.execute(
        "SELECT id_jogo FROM compras WHERE id_usuario = ?",
        [idUsuario]
    );
    return linhas.map((linha) => linha.id_jogo);
}

async function comprar(idUsuario, idJogo) {
    await conexao.execute(
        "INSERT IGNORE INTO compras (id_usuario, id_jogo) VALUES (?, ?)",
        [idUsuario, idJogo]
    );
}

module.exports = { listarIdsDoUsuario, comprar };