// Middlewares de proteção: rodam antes do controller da rota.

// Só deixa passar quem está logado.
function exigirLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Só deixa passar quem está logado e é administrador.
function exigirAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    if (req.session.usuario.perfil !== "admin") {
        return res.status(403).send("Acesso negado: apenas administradores.");
    }
    next();
}

module.exports = { exigirLogin, exigirAdmin };