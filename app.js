const express = require("express");
const session = require("express-session");
const path = require("path");
const jogoController = require("./Controller/jogoController");
const authController = require("./Controller/authController");
const { exigirLogin, exigirAdmin } = require("./middleware/auth");

const app = express();
const PORTA = 3000;

// Define o EJS como motor das views (arquivos da pasta view/).
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Middlewares: rodam antes das rotas.
app.use(express.urlencoded({ extended: true }));            // lê os dados dos formulários (req.body)
app.use(express.static(path.join(__dirname, "public")));    // serve os arquivos de public/ (CSS)

// Sessão: guarda quem está logado (fica num cookie no navegador).
app.use(session({
    secret: "troque-este-segredo-do-catalogo",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }                  // 2 horas
}));

// Deixa o usuário logado disponível em todas as views (variável "usuario").
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

// Rotas: cada uma chama uma função do controller.
app.get("/", (req, res) => {
    res.redirect("/jogos");
});

// Cadastro e login (públicos)
app.get("/login", authController.formLogin);
app.post("/login", authController.login);
app.get("/cadastro", authController.formCadastro);
app.post("/cadastro", authController.cadastrar);
app.get("/logout", authController.logout);

// Cadastro de administrador (só admin)
app.get("/admin/cadastro", exigirAdmin, authController.formCadastroAdmin);
app.post("/admin/cadastro", exigirAdmin, authController.cadastrarAdmin);

// Jogos (exigem login)
app.get("/jogos", exigirLogin, jogoController.listar);                   // lista e filtra
app.get("/jogos/novo", exigirLogin, jogoController.formNovo);            // formulário de cadastro
app.get("/jogos/:id/editar", exigirLogin, jogoController.formEditar);    // formulário de edição
app.post("/jogos/salvar", exigirLogin, jogoController.salvar);           // cadastra ou atualiza
app.post("/jogos/:id/excluir", exigirLogin, jogoController.excluir);     // exclui

// Middleware de erro: captura qualquer falha (ex: banco desligado).
app.use((erro, req, res, next) => {
    console.error(erro);
    res.status(500).send("Erro no servidor: " + erro.message);
});

app.listen(PORTA, () => {
    console.log("Servidor rodando em http://localhost:" + PORTA);
});