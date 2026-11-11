const conexao = require("./conexao");

// Busca um usuário pelo e-mail (usado no login e para evitar e-mail repetido).
async function buscarPorEmail(email) {
    const [usuarios] = await conexao.execute(
        "SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ?",
        [email]
    );
    return usuarios[0];
}

// Grava um usuário novo. A senha já chega criptografada (hash).
async function inserir(nome, email, senhaHash, perfil) {
    await conexao.execute(
        "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
        [nome, email, senhaHash, perfil]
    );
}

module.exports = { buscarPorEmail, inserir };