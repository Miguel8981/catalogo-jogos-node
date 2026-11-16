const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const jogoController = require("./controller/jogoController");
const authController = require("./controller/authController");
const compraController = require("./controller/compraController");
const lojaController = require("./controller/lojaController");
const perfilController = require("./controller/perfilController");
const wikiController = require("./controller/wikiController");
const { upload } = require("./middleware/upload");
const { exigirLogin, exigirAdmin } = require("./middleware/auth");

const app = express();
const PORTA = Number(process.env.PORT) || 3001;

// CORS: permite que o front-end Vue (localhost:8080) converse com esta API
// e envie o cookie da sessão (credentials: true).
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());   // lê o corpo das requisições em JSON (req.body)

// Catálogo editorial da wiki: leitura pública, separado dos jogos da biblioteca.
app.get("/api/wiki/estatisticas", wikiController.estatisticas);
app.get("/api/wiki/jogos", wikiController.listar);
app.get("/api/wiki/jogos/:id", wikiController.buscar);

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

// Biblioteca: o usuário vê o que já adicionou e adiciona jogos
app.get("/api/compras", exigirLogin, compraController.listar);
app.post("/api/compras/:idJogo", exigirLogin, compraController.comprar);
app.get("/api/biblioteca", exigirLogin, compraController.biblioteca);   // Minha biblioteca

// Catálogo: detalhes do jogo e status pessoal do usuário (Quero jogar, Jogando, Zerado)
// ATENÇÃO: "destaques" precisa vir ANTES de "/:id", senão o Express acha que "destaques" é um id.
app.get("/api/loja/destaques", exigirLogin, lojaController.destaques);
app.get("/api/loja/:id", exigirLogin, lojaController.detalhe);
app.put("/api/loja/:id/status", exigirLogin, lojaController.definirStatus);

// Perfil: cada usuário (ou admin) vê e edita os próprios dados
app.get("/api/perfil", exigirLogin, perfilController.ver);
app.put("/api/perfil", exigirLogin, perfilController.atualizar);
app.put("/api/perfil/senha", exigirLogin, perfilController.alterarSenha);

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
