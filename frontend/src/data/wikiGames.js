import records from "./wikiGames.json";

// Valores padrão mantêm a interface compatível com fichas clássicas incompletas.
export function normalizeGame(game) {
  return {
    ...game,
    genres: game.genres || [],
    platforms: game.platforms || [],
    modes: game.modes || [],
    videos: game.videos || [],
    screenshots: game.screenshots || [],
    highlights: game.highlights || [],
    score: game.score || "—",
    tagline: game.tagline || game.name,
    description: game.description || "Descrição em atualização.",
    developer: game.developer || "Não informado",
    publisher: game.publisher || "Não informado",
    releaseDate: game.releaseDate || String(game.year || "Não informado"),
    specs: game.specs || null
  };
}

export default records.map(normalizeGame);
