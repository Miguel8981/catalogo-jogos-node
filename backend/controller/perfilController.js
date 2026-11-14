const bcrypt = require("bcryptjs");
const usuarioModel = require("../model/usuarioModel");

// GET /api/perfil  ->  dados do usuário logado (lidos do banco, sem a senha)
async function ver(req, res) {
    const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);

    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    res.json({ usuario });
}

// PUT /api/perfil  ->  edita nome e e-mail do próprio usuário (exige a senha atual)
async function atualizar(req, res) {
    const id = req.session.usuario.id;
    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const senhaAtual = req.body.senhaAtual || "";

    if (nome === "" || email === "") {
        return res.status(400).json({ erro: "Preencha nome e e-mail." });
    }
    if (!email.includes("@")) {
        return res.status(400).json({ erro: "Informe um e-mail válido." });
    }
    if (senhaAtual === "") {
        return res.status(400).json({ erro: "Informe a senha atual para confirmar a alteração." });
    }

    // Confere a senha atual antes de mexer nos dados da conta.
    const hashAtual = await usuarioModel.buscarSenhaPorId(id);
    const senhaCorreta = hashAtual ? await bcrypt.compare(senhaAtual, hashAtual) : false;
    if (!senhaCorreta) {
        return res.status(400).json({ erro: "A senha atual está incorreta." });
    }

    // O e-mail não pode ser de OUTRA pessoa (o próprio e-mail atual é permitido).
    const existente = await usuarioModel.buscarPorEmail(email);
    if (existente && existente.id !== id) {
        return res.status(400).json({ erro: "Já existe um usuário com este e-mail." });
    }

    await usuarioModel.atualizarDados(id, nome, email);

    // Mantém a sessão em dia: o cabeçalho passa a mostrar o nome novo.
    req.session.usuario.nome = nome;
    req.session.usuario.email = email;

    res.json({ msg: "Dados atualizados com sucesso!", usuario: req.session.usuario });
}

// PUT /api/perfil/senha  ->  troca a senha (exige a senha atual) e faz logout
async function alterarSenha(req, res) {
    const id = req.session.usuario.id;
    const senhaAtual = req.body.senhaAtual || "";
    const novaSenha = req.body.novaSenha || "";
    const confirmar = req.body.confirmar || "";

    if (senhaAtual === "" || novaSenha === "") {
        return res.status(400).json({ erro: "Preencha a senha atual e a nova senha." });
    }
    if (novaSenha.length < 6) {
        return res.status(400).json({ erro: "A nova senha deve ter no mínimo 6 caracteres." });
    }
    if (novaSenha !== confirmar) {
        return res.status(400).json({ erro: "As senhas não conferem." });
    }

    const hashAtual = await usuarioModel.buscarSenhaPorId(id);
    const senhaCorreta = hashAtual ? await bcrypt.compare(senhaAtual, hashAtual) : false;

    if (!senhaCorreta) {
        return res.status(400).json({ erro: "A senha atual está incorreta." });
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);
    await usuarioModel.atualizarSenha(id, novoHash);

    // Encerra a sessão: o usuário precisa entrar de novo com a senha nova.
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ msg: "Senha alterada com sucesso! Faça login com a nova senha." });
    });
}

module.exports = { ver, atualizar, alterarSenha };