<template>
  <div class="wiki-page catalog-page">
    <div class="catalog-heading">
      <div><span class="eyebrow">BIBLIOTECA DE REFERÊNCIA</span><h1>Catálogo de jogos<span class="accent-period">.</span></h1>
        <p>Procure por gênero, plataforma ou avaliação e descubra sua próxima aventura.</p>
      </div>
      <span class="catalog-count"><strong>{{ String(filteredGames.length).padStart(2, '0') }}</strong> DE {{ String(totalGames).padStart(2, '0') }} JOGOS</span>
    </div>

    <div class="catalog-tools">
      <label class="catalog-search"><span>⌕</span><input v-model="search" type="search" placeholder="Buscar jogo, estúdio ou gênero..." aria-label="Buscar no catálogo"></label>
      <div class="catalog-selects">
        <label class="catalog-select"><span>PLATAFORMA</span><select v-model="activePlatform" aria-label="Filtrar por plataforma"><option value="Todas">Todas as plataformas</option><option v-for="platform in platforms" :key="platform" :value="platform">{{ platform }}</option></select></label>
        <label class="catalog-select"><span>ORDENAR POR</span><select v-model="sortBy" aria-label="Ordenar catálogo"><option value="destaques">Seleção editorial</option><option value="comunidade">Avaliação da comunidade</option><option value="recentes">Lançamento mais recente</option><option value="nome">Nome A–Z</option></select></label>
        <button v-if="temFiltrosAtivos" type="button" class="catalog-reset" @click="limparFiltros">Limpar filtros <span>×</span></button>
      </div>
      <div class="genre-filters" aria-label="Filtrar por gênero">
        <button v-for="genre in genres" :key="genre" type="button" :class="{ selected: activeGenre === genre }" @click="activeGenre = genre">{{ genre }}</button>
      </div>
      <p class="catalog-results"><span v-if="isLoading" class="catalog-live-dot"></span>{{ isLoading ? 'Consultando a API do catálogo…' : `${filteredGames.length} ${filteredGames.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}` }} <span>·</span> {{ apiStatus }}</p>
    </div>

    <section class="wiki-card-grid catalog-grid">
      <router-link v-for="(game, index) in filteredGames" :key="game.id" class="wiki-card" :to="`/catalogo/${game.id}`">
        <div class="wiki-card-art">
          <img v-if="game.cover" :src="game.cover" :alt="`Capa de ${game.name}`" loading="lazy" @error="game.cover = ''">
          <span v-else class="cover-placeholder-label">{{ game.name }}</span>
          <span class="wiki-card-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span v-if="game.communityReview" class="wiki-card-score">{{ game.communityReview.recommendPercent }}<small>% recomendam</small></span>
          <span v-else-if="game.score !== '—'" class="wiki-card-score">{{ game.score }}<small> nota</small></span>
          <span v-else class="wiki-card-score card-score-pending">FICHA</span>
        </div>
        <div class="wiki-card-info"><div><h2>{{ game.name }}</h2><p>{{ game.developer }} · {{ game.year }}</p></div><span class="card-arrow">↗</span></div>
        <div class="card-genres"><span v-for="genre in game.genres.slice(0, 2)" :key="genre">{{ genre }}</span></div>
      </router-link>
    </section>

    <div v-if="filteredGames.length === 0" class="catalog-empty"><span>⌕</span><h2>Nenhum jogo encontrado</h2><p>Tente outro termo ou escolha um gênero diferente.</p><button type="button" class="quiet-button" @click="limparFiltros">Limpar filtros</button></div>
    <p class="catalog-footnote">NOTAS E CONTEÚDO EDITORIAL · FICHAS EM EXPANSÃO</p>
  </div>
</template>

<script>
import api from "../services/axiosInstance";
import { normalizeGame } from "../data/wikiGameUtils";

export default {
  name: "CatalogoView",
  data() {
    return { games: [], totalGames: 0, allPlatforms: [], search: this.$route.query.q || "", activeGenre: "Todos", activePlatform: "Todas", sortBy: this.$route.query.sort || "destaques", genres: ["Todos", "Monster Hunter", "Ação", "Aventura", "RPG", "Indie", "Mundo aberto"], isLoading: false, apiStatus: "dados atualizados pelo servidor da wiki", requestTimer: null, requestSequence: 0 };
  },
  created() { this.carregarEstatisticas(); this.carregarCatalogo(); },
  beforeUnmount() { clearTimeout(this.requestTimer); },
  computed: {
    platforms() { return this.allPlatforms; },
    temFiltrosAtivos() { return Boolean(this.search || this.activeGenre !== "Todos" || this.activePlatform !== "Todas" || this.sortBy !== "destaques"); },
    filteredGames() {
      return this.games;
    }
  },
  watch: {
    search() { this.agendarBusca(); },
    activeGenre() { this.agendarBusca(); },
    activePlatform() { this.agendarBusca(); },
    sortBy() { this.agendarBusca(); },
    "$route.query.q"(value) { this.search = value || ""; },
    "$route.query.sort"(value) { if (value) this.sortBy = value; }
  },
  methods: {
    agendarBusca() { clearTimeout(this.requestTimer); this.requestTimer = setTimeout(this.carregarCatalogo, 220); },
    async carregarEstatisticas() {
      try {
        const response = await api.get("/wiki/estatisticas");
        this.totalGames = response.data.totalGames || 0;
        this.allPlatforms = response.data.platforms || [];
      } catch (error) {
        console.warn("Estatísticas do catálogo indisponíveis.", error.message);
      }
    },
    async carregarCatalogo() {
      const sequence = ++this.requestSequence;
      this.isLoading = true;
      const params = { q: this.search.trim(), genero: this.activeGenre, plataforma: this.activePlatform, ordenar: this.sortBy === "destaques" ? "comunidade" : this.sortBy };
      try {
        const response = await api.get("/wiki/jogos", { params });
        if (sequence !== this.requestSequence) return;
        if (Array.isArray(response.data)) {
          this.games = response.data.map(normalizeGame);
          this.apiStatus = "busca filtrada pela API · dados do banco editorial";
        }
      } catch (error) {
        if (sequence !== this.requestSequence) return;
        const { default: localGames } = await import("../data/wikiGames");
        this.totalGames = localGames.length;
        this.allPlatforms = [...new Set(localGames.flatMap((game) => game.platforms || []))].sort((a, b) => a.localeCompare(b, "pt-BR"));
        const query = params.q.toLocaleLowerCase("pt-BR");
        this.games = localGames.filter((game) => {
          const matchesGenre = params.genero === "Todos" || (params.genero === "Monster Hunter" ? game.franchise === "Monster Hunter" : game.genres.includes(params.genero));
          const matchesPlatform = params.plataforma === "Todas" || game.platforms.some((item) => item.toLocaleLowerCase("pt-BR").includes(params.plataforma.toLocaleLowerCase("pt-BR")));
          return matchesGenre && matchesPlatform && (!query || [game.name, game.originalName, game.developer, game.publisher, game.franchise, ...game.genres, ...game.platforms].join(" ").toLocaleLowerCase("pt-BR").includes(query));
        });
        if (params.ordenar === "recentes") this.games.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
        else if (params.ordenar === "nome") this.games.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        else this.games.sort((a, b) => Number(b.communityReview?.recommendPercent || 0) - Number(a.communityReview?.recommendPercent || 0));
        this.apiStatus = "modo local · API indisponível";
        console.warn("Usando catálogo local: API wiki indisponível.", error.message);
      } finally { if (sequence === this.requestSequence) this.isLoading = false; }
    },
    limparFiltros() { this.search = ""; this.activeGenre = "Todos"; this.activePlatform = "Todas"; this.sortBy = "destaques"; }
  }
};
</script>
