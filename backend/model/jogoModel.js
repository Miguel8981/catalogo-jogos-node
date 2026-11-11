const conexao = require("./conexao");

// Lista todos os jogos. Se idGenero for maior que 0, filtra por gênero.
async function listar(idGenero) {
    let sql = `SELECT j.id, j.nome, j.plataforma, j.ano_lancamento, j.nota, j.status, g.nome AS genero
               FROM jogos j
               INNER JOIN generos g ON g.id = j.id_genero`;
    const parametros = [];

    if (idGenero > 0) {
        sql += " WHERE j.id_genero = ?";
        parametros.push(idGenero);
    }

    sql += " ORDER BY j.nome";

    const [jogos] = await conexao.execute(sql, parametros);
    return jogos;
}

// Busca um jogo pelo id (usado na tela de edição).
async function buscar(id) {
    const [jogos] = await conexao.execute(
        "SELECT id, nome, plataforma, ano_lancamento, nota, status, id_genero FROM jogos WHERE id = ?",
        [id]
    );
    return jogos[0];
}

async function inserir(nome, plataforma, ano, nota, status, idGenero) {
    await conexao.execute(
        "INSERT INTO jogos (nome, plataforma, ano_lancamento, nota, status, id_genero) VALUES (?, ?, ?, ?, ?, ?)",
        [nome, plataforma, ano, nota, status, idGenero]
    );
}

async function atualizar(id, nome, plataforma, ano, nota, status, idGenero) {
    await conexao.execute(
        "UPDATE jogos SET nome = ?, plataforma = ?, ano_lancamento = ?, nota = ?, status = ?, id_genero = ? WHERE id = ?",
        [nome, plataforma, ano, nota, status, idGenero, id]
    );
}

async function excluir(id) {
    await conexao.execute("DELETE FROM jogos WHERE id = ?", [id]);
}

module.exports = { listar, buscar, inserir, atualizar, excluir };
