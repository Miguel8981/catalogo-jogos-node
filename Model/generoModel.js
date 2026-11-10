const conexao = require("./conexao");

// Lista os gêneros (usado no select do formulário e no filtro).
async function listar() {
    const [generos] = await conexao.execute("SELECT id, nome FROM generos ORDER BY nome");
    return generos;
}

module.exports = { listar };
