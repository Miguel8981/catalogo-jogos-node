const bcrypt = require("bcryptjs");
const usuarioModel = require("../Model/usuarioModel");

// GET /login  ->  formulário de login
function formLogin(req, res) {
    if (req.session.usuario) {
        return res.redirect("/jogos");
    }

    res.render("login", {
        email: "",
        erro: req.query.erro || "",
        msg: req.query.msg || ""
    });
}

// POST /login  ->  confere e-mail e senha e abre a sessão
async function login(req, res) {
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = req.body.senha || "";

    const usuario = await usuarioModel.buscarPorEmail(email);
    const senhaCorreta = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

    if (!usuario || !senhaCorreta) {
        return res.render("login", {
            email: email,
            erro: "E-mail ou senha incorretos.",
            msg: ""
        });
    }

    // Guarda na sessão só o necessário (nunca o hash da senha).
    req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
    };

    res.redirect("/jogos");
}

// GET /cadastro  ->  formulário de criação de conta (perfil "usuario")
function formCadastro(req, res) {
    res.render("cad_usuario", {
        titulo: "Criar conta",
        action: "/cadastro",
        voltar: "/login",
        nome: "",
        email: "",
        erro: ""
    });
}

// GET /admin/cadastro  ->  formulário de criação de administrador
function formCadastroAdmin(req, res) {
    res.render("cad_usuario", {
        titulo: "Cadastrar administrador",
        action: "/admin/cadastro",
        voltar: "/jogos",
        nome: "",
        email: "",
        erro: ""
    });
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
async function gravarUsuario(req, res, perfil, view, titulo, action, voltar, destinoOk) {
    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = req.body.senha || "";
    const confirmar = req.body.confirmar || "";

    const erro = await validar(nome, email, senha, confirmar);

    if (erro !== "") {
        return res.render(view, {
            titulo: titulo,
            action: action,
            voltar: voltar,
            nome: nome,
            email: email,
            erro: erro
        });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await usuarioModel.inserir(nome, email, senhaHash, perfil);

    res.redirect(destinoOk);
}

// POST /cadastro
async function cadastrar(req, res) {
    await gravarUsuario(
        req, res, "usuario", "cad_usuario",
        "Criar conta", "/cadastro", "/login",
        "/login?msg=" + encodeURIComponent("Conta criada! Faça login.")
    );
}

// POST /admin/cadastro
async function cadastrarAdmin(req, res) {
    await gravarUsuario(
        req, res, "admin", "cad_usuario",
        "Cadastrar administrador", "/admin/cadastro", "/jogos",
        "/jogos?msg=" + encodeURIComponent("Administrador cadastrado com sucesso!")
    );
}

// GET /logout
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/login");
    });
}

module.exports = {
    formLogin, login,
    formCadastro, cadastrar,
    formCadastroAdmin, cadastrarAdmin,
    logout
};