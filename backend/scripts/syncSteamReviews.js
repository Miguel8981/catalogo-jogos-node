const fs = require("fs");
const path = require("path");

const catalogPath = path.join(__dirname, "../../frontend/src/data/wikiGames.json");
const games = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const updatedAt = new Date().toISOString();
// Sínteses em português, escritas a partir de amostras públicas positivas e negativas da Steam.
const takeaways = {
  "monster-hunter-world": ["O ecossistema, a variedade de monstros e as caçadas cooperativas são os pontos mais celebrados.", "Parte dos jogadores relata caçadas longas e problemas técnicos pontuais, como sincronização de saves."],
  "monster-hunter-rise": ["O ritmo ágil do combate e as novas opções de mobilidade aparecem entre os elogios recorrentes.", "Algumas avaliações reclamam de problemas com saves, excesso de diálogos iniciais e ajustes para jogar online."],
  "monster-hunter-wilds": ["A ação de caça e o mundo vivo atraem quem procura uma experiência Monster Hunter mais recente.", "As avaliações críticas destacam desempenho no PC, travamentos e o ritmo da narrativa."],
  "baldurs-gate-3": ["Escolhas com impacto, liberdade de interpretação e a jornada do grupo são muito elogiadas.", "A quantidade de sistemas e diálogos pode parecer excessiva, e o combate por turnos não agrada a todos."],
  "black-myth-wukong": ["Chefes, apresentação visual e o combate contra criaturas marcantes recebem elogios.", "Alguns jogadores apontam repetição no combate, navegação confusa e dificuldade que parece pouco justa."],
  "cyberpunk-2077": ["Night City, personagens e narrativa mantêm jogadores envolvidos por várias jornadas.", "As avaliações negativas consultadas mencionam atualizações problemáticas e falhas de estabilidade no PC."],
  "dark-souls-iii": ["Combate preciso, chefes e exploração de áreas interligadas sustentam o apelo do jogo.", "A dificuldade e alguns problemas de desempenho ou travamentos em PCs atuais aparecem nas críticas."],
  "doom-eternal": ["Combate veloz, arsenal variado e a intensidade constante agradam aos fãs de ação.", "A velocidade, as seções de plataforma e os quebra-cabeças dividem jogadores que preferiam o ritmo de DOOM (2016)."],
  "elden-ring": ["Exploração livre, chefes e a sensação de descobrir algo inesperado são os maiores destaques.", "A dificuldade pode afastar iniciantes; jogadores também citam desempenho e falta de recursos como ultrawide."],
  "fallout-4": ["Explorar o mundo e criar a própria aventura fazem muita gente voltar, com mods ampliando as possibilidades.", "A história principal é vista como menos marcante por alguns, e atualizações podem quebrar mods."],
  "final-fantasy-vii-remake-intergrade": ["Trilha sonora, apresentação e a expansão de personagens queridos são pontos fortes.", "Críticas mencionam ritmo arrastado, cenas prolongadas e um sistema de combate que pode não agradar a quem prefere turnos."],
  "forza-horizon-5": ["Direção acessível, variedade de carros, cenários e qualidade visual agradam aos fãs de corrida.", "Alguns jogadores consideram a progressão inchada e criticam exigências de conta ou conexão."],
  "ghost-of-tsushima-director-s-cut": ["A paisagem de Tsushima, a atmosfera e o combate de samurai conquistam muitos jogadores.", "As missões podem se repetir e parte do público acha a estrutura de mundo aberto previsível."],
  "god-of-war": ["A relação entre Kratos e Atreus e a narrativa emocional são os elogios mais fortes.", "Há críticas à variedade de inimigos, ao ritmo das lutas e a puzzles que interrompem a aventura."],
  "hades": ["Combate responsivo, personagens, arte e música fazem as tentativas repetidas parecerem recompensadoras.", "O formato roguelike e a repetição das partidas podem cansar quem não gosta desse ciclo."],
  "hades-ii": ["Arte, trilha, quantidade de conteúdo e evolução do combate recebem avaliações positivas.", "Parte dos jogadores compara a sequência à primeira e discute balanceamento e mudanças no ritmo."],
  "hollow-knight": ["Hallownest, a exploração e a arte desenhada à mão são lembrados com muito carinho.", "A dificuldade e a necessidade de explorar sem muitas indicações podem frustrar alguns jogadores."],
  "hollow-knight-silksong": ["Combate, animação e construção do mundo são elogiados por quem se conecta à aventura.", "As críticas consultadas apontam dificuldade punitiva, deslocamentos longos e progressão frustrante."],
  "it-takes-two": ["A variedade de fases e a cooperação obrigatória criam momentos divertidos para jogar em dupla.", "Humor e personagens dividem opiniões, e algumas avaliações acham puzzles ou chefes pouco inspirados."],
  "persona-5-royal": ["Estilo visual, elenco e o vínculo com os Phantom Thieves formam a experiência mais elogiada.", "A campanha longa e a necessidade de conexão em alguns cenários de uso são pontos de atenção citados."],
  "portal-2": ["Puzzles inventivos, humor e ritmo de campanha continuam agradando em novas partidas.", "Alguns relatos citam limitações de compatibilidade e suporte em sistemas ou controles específicos."],
  "red-dead-redemption-2": ["Narrativa, personagens e atenção aos detalhes do mundo aberto são frequentemente celebrados.", "Ritmo deliberado, bugs persistentes e problemas com launcher ou acesso aparecem entre as ressalvas."],
  "resident-evil-4": ["Combate, atmosfera e vontade de rejogar são destaques para muitos fãs do remake.", "Parte dos fãs prefere o original e critica mudanças, cortes ou diferenças de ritmo."],
  "resident-evil-village": ["Cenários marcantes, exploração e a mistura de ação com horror conquistam jogadores.", "Alguns sentem falta do terror mais intenso de RE7 e criticam a história ou o tom mais voltado à ação."],
  "sea-of-stars-sunset-edition": ["Pixel art, iluminação e música evocam JRPGs clássicos de forma atraente.", "As críticas apontam narrativa, personagens e combate menos envolventes que a apresentação sugere."],
  "sekiro-shadows-die-twice-goty-edition": ["A satisfação de dominar a defesa e os duelos com chefes é o grande destaque.", "A exigência de precisão pode ser frustrante, e alguns relatos mencionam problemas de resolução no PC."],
  "stardew-valley": ["Liberdade para cuidar da fazenda no próprio ritmo e o conteúdo acolhedor mantêm jogadores por muito tempo.", "Minimizar tarefas pode transformar a rotina em trabalho, e combate ou cavernas não agradam a todos."],
  "subnautica": ["Exploração, atmosfera e descoberta gradual da história são os aspectos mais elogiados.", "O começo pode parecer lento, e jogadores relatam limitações no suporte a VR."],
  "terraria": ["Grande variedade de itens, construção e progressão garantem muitas horas de descoberta.", "A quantidade de sistemas pode ser confusa no início, e o combate ou a progressão não funcionam para todos."],
  "the-elder-scrolls-v-skyrim-special-edition": ["Liberdade para explorar e uma comunidade enorme de mods mantêm o jogo vivo.", "Bugs antigos e atualizações que afetam mods aparecem nas críticas mais recentes."],
  "the-witcher-3-wild-hunt-remastered": ["Histórias, personagens e missões secundárias são o motivo de muitas pessoas repetirem a jornada.", "O começo mais lento e relatos de desempenho na edição atualizada são pontos de atenção."],
};

async function readSteamSummary(appId) {
  const params = {
    appid: Number(appId),
    filter: 0,
    review_type: 0,
    purchase_type: 1,
    num_per_page: 1,
    languages: ["all"],
    display_language: "brazilian"
  };
  const url = `https://api.steampowered.com/IUserReviewsService/GetAppReviews/v1/?input_json=${encodeURIComponent(JSON.stringify(params))}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Steam respondeu HTTP ${response.status}`);
  const body = await response.json();
  const summary = body.response?.query_summary;
  if (!summary || !summary.total_reviews) throw new Error("Steam não retornou o resumo de avaliações.");
  return summary;
}

async function main() {
  let updated = 0;
  for (const game of games) {
    if (!game.steamAppId) {
      game.communityReview = null;
      continue;
    }
    try {
      const summary = await readSteamSummary(game.steamAppId);
      game.communityReview = {
        platform: "Steam",
        scoreLabel: summary.review_score_desc,
        totalReviews: summary.total_reviews,
        positive: summary.total_positive,
        negative: summary.total_negative,
        recommendPercent: Math.round((summary.total_positive / summary.total_reviews) * 100),
        praise: takeaways[game.id]?.[0] || "Jogadores elogiam a experiência e os elementos centrais da aventura.",
        caveat: takeaways[game.id]?.[1] || "As avaliações também registram ressalvas que variam conforme o perfil de cada jogador.",
        updatedAt,
        url: `https://store.steampowered.com/app/${game.steamAppId}/?l=brazilian#app_reviews_hash`
      };
      updated += 1;
    } catch (error) {
      console.warn(`${game.name}: ${error.message}`);
      game.communityReview = null;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  fs.writeFileSync(catalogPath, JSON.stringify(games, null, 2) + "\n", "utf8");
  console.log(`Resumo da comunidade atualizado em ${updated} fichas Steam.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
