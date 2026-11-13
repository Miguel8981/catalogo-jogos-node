const conexao = require("./conexao");

// Lista todos os jogos. Se idGenero for maior que 0, filtra por gênero.
async function listar(idGenero) {
    let sql = `SELECT j.id, j.nome, j.plataforma, j.ano_lancamento, j.nota, j.status, j.imagem, g.nome AS genero
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
        "SELECT id, nome, plataforma, ano_lancamento, nota, status, imagem, id_genero FROM jogos WHERE id = ?",
        [id]
    );
    return jogos[0];
}

// Dados completos de um jogo, com o nome do gênero (usado na tela de detalhes da loja).
async function buscarDetalhe(id) {
    const [jogos] = await conexao.execute(
        `SELECT j.id, j.nome, j.plataforma, j.ano_lancamento, j.nota, j.imagem, g.nome AS genero
         FROM jogos j
         INNER JOIN generos g ON g.id = j.id_genero
         WHERE j.id = ?`,
        [id]
    );
    return jogos[0];
}

async function inserir(nome, plataforma, ano, nota, status, idGenero, imagem) {
    await conexao.execute(
        "INSERT INTO jogos (nome, plataforma, ano_lancamento, nota, status, id_genero, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nome, plataforma, ano, nota, status, idGenero, imagem]
    );
}

// imagem = null significa "não trocou a foto": o COALESCE mantém a foto atual.
async function atualizar(id, nome, plataforma, ano, nota, status, idGenero, imagem) {
    await conexao.execute(
        "UPDATE jogos SET nome = ?, plataforma = ?, ano_lancamento = ?, nota = ?, status = ?, id_genero = ?, imagem = COALESCE(?, imagem) WHERE id = ?",
        [nome, plataforma, ano, nota, status, idGenero, imagem, id]
    );
}

async function excluir(id) {
    await conexao.execute("DELETE FROM jogos WHERE id = ?", [id]);
}

module.exports = { listar, buscar, buscarDetalhe, inserir, atualizar, excluir };