const fs = require("fs");
const path = require("path");

const catalogPath = path.join(__dirname, "../../frontend/src/data/wikiGames.json");
const gamesToImport = [
  {
    appId: 730,
    id: "counter-strike-2",
    franchise: "Counter-Strike",
    tagline: "O clássico FPS tático retorna com confrontos de alta precisão e a tecnologia Source 2.",
    highlights: ["Disputas táticas em equipes, com foco em mira, estratégia e comunicação.", "Economia por rodada: cada decisão influencia o equipamento da equipe.", "Mapas competitivos conhecidos recebem uma nova camada visual com a Source 2."]
  },
  {
    appId: 553850,
    id: "helldivers-2",
    franchise: "Helldivers",
    tagline: "Reúna seu esquadrão e lute por uma galáxia que nunca fica tranquila.",
    highlights: ["Missões cooperativas para até quatro jogadores em uma guerra galáctica.", "Arsenal pesado e ataques orbitais podem ajudar — ou acertar alguém do esquadrão.", "Objetivos e ameaças mudam o ritmo de cada incursão."]
  },
  {
    appId: 230410,
    id: "warframe",
    franchise: "Warframe",
    tagline: "Desperte como um guerreiro biomecânico e atravesse um universo de ficção científica.",
    highlights: ["Combate veloz combina armas, habilidades e movimentação acrobática.", "Dezenas de Warframes permitem experimentar estilos e poderes diferentes.", "Missões cooperativas, mundos abertos e uma história em constante expansão."]
  },
  {
    appId: 275850,
    id: "no-mans-sky",
    franchise: "No Man's Sky",
    tagline: "Uma jornada de exploração espacial por planetas, criaturas e sistemas desconhecidos.",
    highlights: ["Explore planetas gerados proceduralmente e descubra formas de vida.", "Construa bases, pilote naves e atravesse o espaço em busca de novos sistemas.", "A aventura pode ser vivida só ou em grupo, em um universo compartilhado."]
  },
  {
    appId: 1868140,
    id: "dave-the-diver",
    franchise: "DAVE THE DIVER",
    tagline: "Mergulhe de dia em busca de ingredientes e ajude a servir um restaurante à noite.",
    highlights: ["Explore o misterioso Blue Hole, que muda a cada mergulho.", "Pesque ingredientes durante o dia e administre um restaurante de sushi à noite.", "Aventura, progressão e minijogos se encontram em uma apresentação em pixel art."]
  },
  {
    appId: 2379780,
    id: "balatro",
    franchise: "Balatro",
    tagline: "Monte combinações improváveis de pôquer e transforme cada rodada em uma nova estratégia.",
    highlights: ["Construa mãos de pôquer para superar pontuações cada vez maiores.", "Cartas Joker alteram as regras e criam combinações poderosas.", "Partidas roguelike curtas convidam a testar estratégias diferentes."]
  },
  {
    appId: 1172620,
    id: "sea-of-thieves",
    franchise: "Sea of Thieves",
    tagline: "Viva a fantasia pirata: navegue, procure tesouros e conte histórias com sua tripulação.",
    highlights: ["Navegue em grupo, dividindo tarefas entre velas, leme e canhões.", "Caças ao tesouro, batalhas navais e encontros inesperados movimentam o mar.", "O mundo compartilhado transforma cada viagem em uma história diferente."]
  }
];

// Jogos conhecidos em gêneros diferentes. O importador ignora IDs que já estão
// no catálogo e confirma cada resultado diretamente na Steam Store API.
const additionalAppIds = [
  400, 220, 550, 440, 570, 1172470, 578080, 252490, 346110, 892970,
  1621690, 322330, 108600, 1966720, 739630, 548430, 632360, 1794680, 646570, 588650,
  504230, 268910, 261570, 1057090, 848450, 753640, 632470, 1703340, 239030, 391540,
  1150690, 1151640, 1259420, 990080, 2322010, 1817070, 1817190, 1659420, 1888930, 1850570,
  870780, 883710, 952060, 418370, 2124490, 1693980, 268050, 601430, 379720, 205100,
  612880, 1237970, 1238840, 1238810, 359550, 2073850, 2357570, 2767030, 218620, 493520,
  271590, 110800, 1030840, 307690, 638970, 2072450, 2161700, 637650, 2515020, 524220,
  1295510, 921570, 1971650, 2679460, 570940, 335300, 1627720, 1501750, 1325200, 1293830,
  1222680, 2488620, 244210, 227300, 1250410, 1290000, 613100, 255710, 949230, 703080,
  535930, 220200, 433340, 526870, 427520, 457140, 294100, 975370, 813780, 289070,
  1295660, 268500, 281990, 304430, 48000, 383870, 501300, 638230, 683320, 972660,
  553420, 2138710, 1332010, 424840, 860510, 1313140, 653530, 212680, 590380, 381210,
  291550, 1623730, 1326470, 242760, 962130, 648800, 728880, 812140, 2208920, 552520,
  447040, 225540, 1659040, 1085660, 236390, 286160, 304050, 552500, 1086940, 2680010
];

function stripHtml(value = "") {
  return String(value)
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function requirementLines(html = "") {
  const items = String(html).match(/<li\b[^>]*>[\s\S]*?<\/li>/gi) || [];
  return items.map((item) => stripHtml(item).replace(/\s+/g, " ").trim());
}

function requirementValue(lines, pattern) {
  const line = lines.find((item) => pattern.test(item));
  return line ? line.replace(/^[^:]{1,35}:\s*/, "").trim() : "Não informado na página Steam";
}

function mapSpecs(requirements = {}) {
  const minimum = requirementLines(requirements.minimum);
  const recommended = requirementLines(requirements.recommended);
  if (!minimum.length && !recommended.length) return null;
  const fields = [
    /^(SO|Sistema Operacional|Sistema operacional|OS)\s*:/i,
    /^(Processador|Processor)\s*:/i,
    /^(Memória|Memory)\s*:/i,
    /^(Placa de vídeo|Vídeo|Video|Graphics|GPU)\s*:/i,
    /^(Armazenamento|Storage)\s*:/i
  ];
  return {
    min: fields.map((field) => requirementValue(minimum, field)),
    recommended: fields.map((field) => requirementValue(recommended, field))
  };
}

function mapModes(categories = []) {
  const labels = new Set(categories.map((category) => category.description));
  const modes = [];
  if (labels.has("Single-player")) modes.push("Solo");
  if (labels.has("Multi-player")) modes.push("Multiplayer");
  if (labels.has("Online Co-op")) modes.push("Co-op online");
  if (labels.has("Co-op")) modes.push("Co-op");
  if (labels.has("MMO")) modes.push("MMO");
  return modes.length ? modes : ["Consulte a página Steam"];
}

function yearFromRelease(releaseDate = "") {
  const match = String(releaseDate).match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

function slugify(value, fallbackId) {
  const slug = String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[™®©]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || `steam-${fallbackId}`;
}

function metadataHighlights(genres, modes, videoCount, imageCount) {
  const genreLine = genres.length ? `Gêneros registrados na Steam: ${genres.slice(0, 4).join(", ")}.` : "Gêneros em atualização na página oficial.";
  const modeLine = modes.length ? `Modos disponíveis: ${modes.join(", ")}.` : "Consulte a página oficial para os modos disponíveis.";
  return [genreLine, modeLine, `Ficha alimentada pela Steam Store API, com ${videoCount} vídeos e ${imageCount} imagens disponíveis.`];
}

function mapGame(config, data) {
  const platformNames = { windows: "PC (Windows)", mac: "Mac", linux: "Linux" };
  const platforms = Object.entries(data.platforms || {})
    .filter(([, available]) => available)
    .map(([platform]) => platformNames[platform] || platform);
  const videos = (data.movies || []).slice(0, 5).map((movie) => ({
    provider: "steam",
    id: String(movie.id),
    title: stripHtml(movie.name) || "Vídeo oficial",
    kind: /gameplay|game play/i.test(movie.name) ? "GAMEPLAY" : "TRAILER",
    src: movie.hls_h264,
    thumbnail: movie.thumbnail
  })).filter((video) => video.src);

  return {
    id: config.id || slugify(data.name, config.appId),
    steamAppId: config.appId,
    name: stripHtml(data.name),
    originalName: stripHtml(data.name).toLocaleUpperCase("pt-BR"),
    year: yearFromRelease(data.release_date?.date),
    releaseDate: stripHtml(data.release_date?.date) || "Data não informada",
    developer: (data.developers || []).join(", ") || "Não informado",
    publisher: (data.publishers || []).join(", ") || "Não informado",
    franchise: config.franchise || null,
    category: (data.genres || []).map((genre) => genre.description).slice(0, 3).join(" / "),
    genres: (data.genres || []).map((genre) => genre.description).filter(Boolean).slice(0, 5),
    platforms,
    modes: mapModes(data.categories),
    cover: data.header_image || data.capsule_image || "",
    videos,
    screenshots: (data.screenshots || []).map((screenshot) => screenshot.path_full).filter(Boolean).slice(0, 8),
    score: data.metacritic?.score ? String(data.metacritic.score) : "—",
    tagline: config.tagline || stripHtml(data.short_description || data.name),
    description: stripHtml(config.tagline ? (data.about_the_game || data.short_description) : (data.short_description || data.about_the_game || "Descrição em atualização.")),
    highlights: config.highlights || metadataHighlights((data.genres || []).map((genre) => genre.description), mapModes(data.categories), videos.length, (data.screenshots || []).length),
    specs: mapSpecs(data.pc_requirements),
    availability: data.release_date?.coming_soon ? "Em breve" : "Lançado",
    sourceUrl: data.steam_appid ? `https://store.steampowered.com/app/${data.steam_appid}/` : `https://store.steampowered.com/app/${config.appId}/`,
    dataSource: "Steam Store API"
  };
}

async function readStoreApp(appId) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=br&l=brazilian`;
  const response = await fetch(url, { headers: { "User-Agent": "GameAtlasSchoolProject/1.0" } });
  if (!response.ok) throw new Error(`Steam respondeu HTTP ${response.status} para o app ${appId}.`);
  const body = await response.json();
  if (!body[appId]?.success || !body[appId]?.data || body[appId].data.type !== "game") throw new Error(`Steam não retornou uma ficha de jogo para o app ${appId}.`);
  return body[appId].data;
}

async function main() {
  const games = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const knownAppIds = new Set(games.map((game) => Number(game.steamAppId)).filter(Boolean));
  const curatedAppIds = new Set(gamesToImport.map((game) => game.appId));
  const importQueue = [
    ...gamesToImport,
    ...additionalAppIds.filter((appId) => !curatedAppIds.has(appId) && !knownAppIds.has(appId)).map((appId) => ({ appId }))
  ];
  let added = 0;
  let failed = 0;
  for (const config of importQueue) {
    try {
      const data = await readStoreApp(config.appId);
      const game = mapGame(config, data);
      const existingIndex = games.findIndex((item) => item.id === game.id || Number(item.steamAppId) === config.appId);
      if (existingIndex >= 0) games.splice(existingIndex, 1, game);
      else { games.push(game); added += 1; }
      console.log(`Importado: ${game.name} · ${game.videos.length} vídeos · ${game.screenshots.length} imagens`);
    } catch (error) {
      failed += 1;
      console.warn(`Falha ao importar ${config.id}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  fs.writeFileSync(catalogPath, JSON.stringify(games, null, 2) + "\n", "utf8");
  console.log(`${added} jogos adicionados, ${failed} falhas/itens indisponíveis. Catálogo total: ${games.length}. Rode npm run seed:wiki para sincronizar o banco.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
