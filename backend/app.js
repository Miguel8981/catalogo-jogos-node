const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const jogoController = require("./controller/jogoController");
const authController = require("./controller/authController");
const compraController = require("./controller/compraController");
const { upload } = require("./middleware/upload");
const { exigirLogin, exigirAdmin } = require("./middleware/auth");

const app = express();
const PORTA = 3000;

// CORS: permite que o front-end Vue (localhost:8080) converse com esta API
// e envie o cookie da sessão (credentials: true).
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());   // lê o corpo das requisições em JSON (req.body)

// Fotos dos jogos: ficam em backend/uploads e são servidas em /uploads/nome-do-arquivo
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sessão: guarda quem está logado (fica num cookie no navegador).
app.use(session({
    secret: "troque-este-segredo-do-catalogo",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }                  // 2 horas
}));

// Autenticação (públicas)
app.get("/api/sessao", authController.sessao);
app.post("/api/login", authController.login);
app.post("/api/cadastro", authController.cadastrar);
app.post("/api/logout", authController.logout);

// Cadastro de administrador (só admin)
app.post("/api/admin/cadastro", exigirAdmin, authController.cadastrarAdmin);

// Gêneros e jogos: qualquer usuário logado pode VER (listar e filtrar)
app.get("/api/generos", exigirLogin, jogoController.listarGeneros);
app.get("/api/jogos", exigirLogin, jogoController.listar);            // lista e filtra (?genero=)

// Cadastrar, editar e excluir jogos: SOMENTE administrador
app.get("/api/jogos/:id", exigirAdmin, jogoController.buscar);        // um jogo (edição)
app.post("/api/jogos", exigirAdmin, upload.single("imagem"), jogoController.criar);            // cadastra (com foto)
app.put("/api/jogos/:id", exigirAdmin, upload.single("imagem"), jogoController.atualizar);     // atualiza (foto opcional)
app.delete("/api/jogos/:id", exigirAdmin, jogoController.excluir);    // exclui

// Loja: o usuário logado vê o que já comprou e compra jogos
app.get("/api/compras", exigirLogin, compraController.listar);
app.post("/api/compras/:idJogo", exigirLogin, compraController.comprar);

// Middleware de erro: captura qualquer falha (ex: banco desligado).
app.use((erro, req, res, next) => {
    // Erros de upload (foto grande demais ou tipo inválido) viram 400, não 500.
    if (erro.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ erro: "A foto deve ter no máximo 2 MB." });
    }
    if (erro.tipo === "upload" || erro.name === "MulterError") {
        return res.status(400).json({ erro: erro.message });
    }

    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor: " + erro.message });
});

app.listen(PORTA, () => {
    console.log("API rodando em http://localhost:" + PORTA);
});