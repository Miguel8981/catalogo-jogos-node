const multer = require("multer");
const path = require("path");
const fs = require("fs");

const pasta = path.join(__dirname, "..", "uploads");
fs.mkdirSync(pasta, { recursive: true });

const extensoes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const armazenamento = multer.diskStorage({
    destination: (req, file, cb) => cb(null, pasta),
    filename: (req, file, cb) => {
        const nome = Date.now() + "-" + Math.round(Math.random() * 1e6) + extensoes[file.mimetype];
        cb(null, nome);
    }
});

const upload = multer({
    storage: armazenamento,
    limits: { fileSize: 2 * 1024 * 1024 },          // máximo 2 MB
    fileFilter: (req, file, cb) => {
        if (extensoes[file.mimetype]) {
            return cb(null, true);
        }
        const erro = new Error("Envie uma imagem JPG, PNG ou WEBP.");
        erro.tipo = "upload";
        cb(erro);
    }
});

function removerImagem(nomeArquivo) {
    if (!nomeArquivo) {
        return;
    }
    fs.unlink(path.join(pasta, path.basename(nomeArquivo)), () => {});
}

module.exports = { upload, removerImagem };