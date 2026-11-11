function exigirLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: "Faça login para continuar." });
    }
    next();
}

// Só deixa passar quem está logado e é administrador.
function exigirAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: "Faça login para continuar." });
    }
    if (req.session.usuario.perfil !== "admin") {
        return res.status(403).json({ erro: "Acesso negado: apenas administradores." });
    }
    next();
}

module.exports = { exigirLogin, exigirAdmin };