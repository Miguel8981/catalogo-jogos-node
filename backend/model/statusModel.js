const conexao = require("./conexao");

// Status pessoal do usuário em um jogo (ou null se ele ainda não escolheu).
async function buscar(idUsuario, idJogo) {
    const [linhas] = await conexao.execute(
        "SELECT status FROM status_usuario WHERE id_usuario = ? AND id_jogo = ?",
        [idUsuario, idJogo]
    );
    return linhas.length > 0 ? linhas[0].status : null;
}

// Cria o status ou, se já existir, troca pelo novo.
async function salvar(idUsuario, idJogo, status) {
    await conexao.execute(
        `INSERT INTO status_usuario (id_usuario, id_jogo, status) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [idUsuario, idJogo, status]
    );
}

module.exports = { buscar, salvar };