const db = require("../model/conexao");

function gameFromRow(row) {
  try { return JSON.parse(row.detalhes_json); } catch { return null; }
}

exports.listar = async (_req, res, next) => {
  try {
    const [rows] = await db.query("SELECT detalhes_json FROM wiki_jogos ORDER BY nome");
    res.json(rows.map(gameFromRow).filter(Boolean));
  } catch (error) { next(error); }
};

exports.buscar = async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT detalhes_json FROM wiki_jogos WHERE id = ? LIMIT 1", [req.params.id]);
    const game = rows[0] && gameFromRow(rows[0]);
    if (!game) return res.status(404).json({ erro: "Jogo não encontrado." });
    res.json(game);
  } catch (error) { next(error); }
};
