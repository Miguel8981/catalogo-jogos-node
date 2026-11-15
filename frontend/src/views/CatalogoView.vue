<template>
  <div class="wiki-page catalog-page">
    <div class="catalog-heading">
      <div><span class="eyebrow">BIBLIOTECA DE REFERÊNCIA</span><h1>Catálogo de jogos<span class="accent-period">.</span></h1>
        <p>Histórias, plataformas, estúdios e guias para encontrar sua próxima aventura.</p>
      </div>
      <span class="catalog-count"><strong>{{ filteredGames.length.toString().padStart(2, '0') }}</strong> JOGOS</span>
    </div>

    <div class="catalog-tools">
      <label class="catalog-search"><span>⌕</span><input v-model="search" type="search" placeholder="Buscar jogo, estúdio ou gênero..." aria-label="Buscar no catálogo"></label>
      <div class="genre-filters" aria-label="Filtrar por gênero">
        <button v-for="genre in genres" :key="genre" type="button" :class="{ selected: activeGenre === genre }" @click="activeGenre = genre">{{ genre }}</button>
      </div>
    </div>

    <section class="wiki-card-grid catalog-grid">
      <router-link v-for="(game, index) in filteredGames" :key="game.id" class="wiki-card" :to="`/catalogo/${game.id}`">
        <div class="wiki-card-art">
          <img :src="game.cover" :alt="`Capa de ${game.name}`" loading="lazy">
          <span class="wiki-card-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="wiki-card-score">{{ game.score }}<small> / 100</small></span>
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
import games from "../data/wikiGames";
import api from "../services/axiosInstance";
import { normalizeGame } from "../data/wikiGames";

export default {
  name: "CatalogoView",
  data() {
    return { games, search: this.$route.query.q || "", activeGenre: "Todos", genres: ["Todos", "Monster Hunter", "Ação", "Aventura", "RPG", "Indie", "Mundo aberto"] };
  },
  async created() {
    try { const response = await api.get("/wiki/jogos"); if (Array.isArray(response.data)) this.games = response.data.map(normalizeGame); } catch (error) { console.warn("Usando catálogo local: API wiki indisponível.", error.message); }
  },
  computed: {
    filteredGames() {
      const query = this.search.trim().toLocaleLowerCase("pt-BR");
      return this.games.filter((game) => {
        const matchesGenre = this.activeGenre === "Todos" || (this.activeGenre === "Monster Hunter" ? game.franchise === "Monster Hunter" : game.genres.includes(this.activeGenre));
        const searchable = [game.name, game.originalName, game.developer, game.publisher, game.franchise, ...game.genres].join(" ").toLocaleLowerCase("pt-BR");
        return matchesGenre && (!query || searchable.includes(query));
      });
    }
  },
  watch: {
    "$route.query.q"(value) { this.search = value || ""; }
  },
  methods: {
    limparFiltros() { this.search = ""; this.activeGenre = "Todos"; }
  }
};
</script>
