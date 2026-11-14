const conexao = require("./conexao");

// Busca um usuário pelo e-mail (usado no login e para evitar e-mail repetido).
async function buscarPorEmail(email) {
    const [usuarios] = await conexao.execute(
        "SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ?",
        [email]
    );
    return usuarios[0];
}

async function inserir(nome, email, senhaHash, perfil) {
    await conexao.execute(
        "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
        [nome, email, senhaHash, perfil]
    );
}

async function buscarPorId(id) {
    const [usuarios] = await conexao.execute(
        "SELECT id, nome, email, perfil, criado_em FROM usuarios WHERE id = ?",
        [id]
    );
    return usuarios[0];
}

async function buscarSenhaPorId(id) {
    const [usuarios] = await conexao.execute(
        "SELECT senha FROM usuarios WHERE id = ?",
        [id]
    );
    return usuarios.length > 0 ? usuarios[0].senha : null;
}

async function atualizarDados(id, nome, email) {
    await conexao.execute(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
        [nome, email, id]
    );
}

// Troca a senha (já chega criptografada).
async function atualizarSenha(id, senhaHash) {
    await conexao.execute(
        "UPDATE usuarios SET senha = ? WHERE id = ?",
        [senhaHash, id]
    );
}

module.exports = { buscarPorEmail, buscarPorId, buscarSenhaPorId, inserir, atualizarDados, atualizarSenha };