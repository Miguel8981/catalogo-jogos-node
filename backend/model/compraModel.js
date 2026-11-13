const conexao = require("./conexao");

// Ids dos jogos que o usuário já comprou.
async function listarIdsDoUsuario(idUsuario) {
    const [linhas] = await conexao.execute(
        "SELECT id_jogo FROM compras WHERE id_usuario = ?",
        [idUsuario]
    );
    return linhas.map((linha) => linha.id_jogo);
}

// Registra a compra. INSERT IGNORE: comprar duas vezes o mesmo jogo não duplica.
async function comprar(idUsuario, idJogo) {
    await conexao.execute(
        "INSERT IGNORE INTO compras (id_usuario, id_jogo) VALUES (?, ?)",
        [idUsuario, idJogo]
    );
}

// O usuário já comprou este jogo? (true ou false)
async function jaComprou(idUsuario, idJogo) {
    const [linhas] = await conexao.execute(
        "SELECT id FROM compras WHERE id_usuario = ? AND id_jogo = ?",
        [idUsuario, idJogo]
    );
    return linhas.length > 0;
}

module.exports = { listarIdsDoUsuario, comprar, jaComprou };