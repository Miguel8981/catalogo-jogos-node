const db = require("../model/conexao");

function gameFromRow(row) {
  try { return JSON.parse(row.detalhes_json); } catch { return null; }
}

exports.listar = async (_req, res, next) => {
  try {
    const [rows] = await db.query("SELECT detalhes_json FROM wiki_jogos ORDER BY nome");
    let games = rows.map(gameFromRow).filter(Boolean);
    const query = String(_req.query.q || "").trim().toLocaleLowerCase("pt-BR");
    const genre = String(_req.query.genero || "").trim().toLocaleLowerCase("pt-BR");
    const platform = String(_req.query.plataforma || "").trim().toLocaleLowerCase("pt-BR");
    if (query) games = games.filter((game) => [game.name, game.originalName, game.developer, game.publisher, game.franchise, ...(game.genres || []), ...(game.platforms || [])].join(" ").toLocaleLowerCase("pt-BR").includes(query));
    if (genre && genre !== "todos") games = games.filter((game) => (genre === "monster hunter" ? game.franchise === "Monster Hunter" : (game.genres || []).some((item) => item.toLocaleLowerCase("pt-BR") === genre)));
    if (platform && platform !== "todas") games = games.filter((game) => (game.platforms || []).some((item) => item.toLocaleLowerCase("pt-BR").includes(platform)));
    const sort = String(_req.query.ordenar || "nome");
    if (sort === "recentes") games.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    else if (sort === "comunidade") games.sort((a, b) => Number(b.communityReview?.recommendPercent || 0) - Number(a.communityReview?.recommendPercent || 0));
    else if (sort === "nome") games.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    res.set("Cache-Control", "public, max-age=60").json(games);
  } catch (error) { next(error); }
};

exports.estatisticas = async (_req, res, next) => {
  try {
    const [rows] = await db.query("SELECT detalhes_json FROM wiki_jogos");
    const games = rows.map(gameFromRow).filter(Boolean);
    const platforms = [...new Set(games.flatMap((game) => game.platforms || []))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    res.set("Cache-Control", "public, max-age=300").json({
      totalGames: games.length,
      gamesWithReviews: games.filter((game) => game.communityReview).length,
      gamesWithVideos: games.filter((game) => (game.videos || []).length).length,
      totalCommunityReviews: games.reduce((sum, game) => sum + Number(game.communityReview?.totalReviews || 0), 0),
      genres: [...new Set(games.flatMap((game) => game.genres || []))].sort((a, b) => a.localeCompare(b, "pt-BR")),
      platforms,
      dataSources: ["Catálogo editorial", "Steam — avaliações da comunidade", "Vídeos e imagens vinculados às fichas"]
    });
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
