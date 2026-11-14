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

// Biblioteca do usuário: jogos que ele adicionou OU que marcou como "Quero jogar",
// cada um com o status pessoal dele (null = ainda sem status).
async function listarBiblioteca(idUsuario) {
    const [jogos] = await conexao.execute(
        `SELECT j.id, j.nome, j.plataforma, j.ano_lancamento, j.nota, j.imagem,
                g.nome AS genero, s.status,
                (c.id IS NOT NULL) AS adicionado
         FROM jogos j
         INNER JOIN generos g ON g.id = j.id_genero
         LEFT JOIN compras c ON c.id_jogo = j.id AND c.id_usuario = ?
         LEFT JOIN status_usuario s ON s.id_jogo = j.id AND s.id_usuario = ?
         WHERE c.id IS NOT NULL OR s.id IS NOT NULL
         ORDER BY j.nome`,
        [idUsuario, idUsuario]
    );
    return jogos;
}

module.exports = { listarIdsDoUsuario, comprar, jaComprou, listarBiblioteca };