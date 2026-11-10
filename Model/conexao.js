const mysql = require("mysql2/promise");

// Pool de conexões com o MySQL do XAMPP.
const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "catalogo_jogos",
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = conexao;
