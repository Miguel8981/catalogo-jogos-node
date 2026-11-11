const bcrypt = require("bcryptjs");
const usuarioModel = require("../model/usuarioModel");

// GET /api/sessao  ->  devolve o usuário logado (ou null)
function sessao(req, res) {
    res.json({ usuario: req.session.usuario || null });
}

// POST /api/login  ->  confere e-mail e senha e abre a sessão
async function login(req, res) {
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = req.body.senha || "";

    const usuario = await usuarioModel.buscarPorEmail(email);
    const senhaCorreta = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

    if (!usuario || !senhaCorreta) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    // Guarda na sessão só o necessário (nunca o hash da senha).
    req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
    };

    res.json({ usuario: req.session.usuario });
}

// Devolve o texto do erro, ou "" se estiver tudo certo.
async function validar(nome, email, senha, confirmar) {
    if (nome === "" || email === "" || senha === "") {
        return "Preencha todos os campos.";
    }
    if (senha.length < 6) {
        return "A senha deve ter no mínimo 6 caracteres.";
    }
    if (senha !== confirmar) {
        return "As senhas não conferem.";
    }
    if (await usuarioModel.buscarPorEmail(email)) {
        return "Já existe um usuário com este e-mail.";
    }
    return "";
}

// Parte comum do cadastro de usuário comum e de administrador.
async function gravarUsuario(req, res, perfil) {
    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = req.body.senha || "";
    const confirmar = req.body.confirmar || "";

    const erro = await validar(nome, email, senha, confirmar);

    if (erro !== "") {
        return res.status(400).json({ erro: erro });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await usuarioModel.inserir(nome, email, senhaHash, perfil);

    res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
}

// POST /api/cadastro  ->  cria conta com perfil "usuario"
async function cadastrar(req, res) {
    await gravarUsuario(req, res, "usuario");
}

// POST /api/admin/cadastro  ->  cria conta com perfil "admin"
async function cadastrarAdmin(req, res) {
    await gravarUsuario(req, res, "admin");
}

// POST /api/logout
function logout(req, res) {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ msg: "Sessão encerrada." });
    });
}

module.exports = { sessao, login, cadastrar, cadastrarAdmin, logout };