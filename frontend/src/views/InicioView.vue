<template>
  <div class="wiki-page">
    <section class="wiki-hero" :style="{ '--hero-image': `url(${featured.cover})` }">
      <div class="wiki-hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> JOGO EM DESTAQUE</span>
        <p class="hero-kicker">{{ featured.originalName }} · {{ featured.year }}</p>
        <h1>{{ featured.name }}</h1>
        <p class="hero-description">{{ featured.tagline }}</p>
        <div class="hero-tags">
          <span v-for="genre in featured.genres.slice(0, 3)" :key="genre">{{ genre }}</span>
        </div>
        <router-link class="primary-link" :to="`/catalogo/${featured.id}`">Explorar jogo <span>↗</span></router-link>
      </div>
      <div class="hero-index"><span>01</span><i></i>DESTAQUE</div>
    </section>

    <section class="home-intro">
      <div>
        <span class="eyebrow">UM UNIVERSO DE JOGOS, EM UM SÓ LUGAR</span>
        <h2>Conheça antes de jogar.</h2>
      </div>
      <p>Uma biblioteca feita para ir além da capa: explore mundos, compare avaliações da comunidade, assista a trailers e confira o que cada jogo exige.</p>
    </section>

    <section class="home-discovery" aria-labelledby="discovery-title">
      <div class="discovery-heading"><span class="eyebrow">EXPLORE DO SEU JEITO</span><h2 id="discovery-title">Qual será sua próxima aventura?</h2></div>
      <div class="discovery-chips">
        <router-link v-for="item in discoveryLinks" :key="item.label" :to="{ path: '/catalogo', query: { q: item.query } }"><span>{{ item.symbol }}</span>{{ item.label }}<b>↗</b></router-link>
      </div>
      <div class="discovery-stats"><span><strong>{{ catalogCount }}</strong> FICHAS NO BANCO</span><i></i><span><strong>{{ ratedCount }}</strong> COM AVALIAÇÕES DA COMUNIDADE</span><i></i><span><strong>{{ formattedReviewCount }}</strong> OPINIÕES STEAM</span></div>
      <div class="api-showcase"><div class="api-orbit"><span>API</span><i></i><i></i><i></i></div><div class="api-copy"><span class="eyebrow"><span class="api-live-dot"></span> {{ apiStatus }}</span><h3>Dados que vêm de mais de uma fonte.</h3><p>O catálogo editorial é servido pelo backend e banco de dados. As avaliações da comunidade vêm da Steam; trailers e imagens completam cada ficha.</p></div><div class="api-sources"><span v-for="source in dataSources" :key="source"><i></i>{{ source }}</span></div></div>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <div><span class="eyebrow">DA COMUNIDADE</span><h2>Vale conhecer</h2></div>
        <router-link to="/catalogo" class="text-link">Ver catálogo completo <span>→</span></router-link>
      </div>
      <div class="wiki-card-grid">
        <router-link v-for="(game, index) in recommendations" :key="game.id" class="wiki-card" :to="`/catalogo/${game.id}`">
          <div class="wiki-card-art">
            <img :src="game.cover" :alt="`Capa de ${game.name}`" loading="lazy">
            <span class="wiki-card-number">0{{ index + 1 }}</span>
            <span class="wiki-card-score" v-if="game.communityReview">{{ game.communityReview.recommendPercent }}<small>% recomendam</small></span>
            <span class="wiki-card-score" v-else-if="game.score && game.score !== '—'">{{ game.score }}<small> / 100</small></span>
            <span class="wiki-card-score card-score-pending" v-else>FICHA</span>
          </div>
          <div class="wiki-card-info">
            <div><h3>{{ game.name }}</h3><p>{{ game.developer }} · {{ game.year }}</p></div>
            <span class="card-arrow">↗</span>
          </div>
          <div class="card-genres"><span v-for="genre in game.genres.slice(0, 2)" :key="genre">{{ genre }}</span></div>
        </router-link>
      </div>
    </section>

    <section class="wiki-cta">
      <div><span class="eyebrow">EXPLORE SEM PRESSA</span><h2>Seu próximo jogo pode estar aqui.</h2></div>
      <router-link to="/catalogo" class="primary-link">Abrir catálogo <span>→</span></router-link>
    </section>
  </div>
</template>

<script>
import api from "../services/axiosInstance";
import { normalizeGame } from "../data/wikiGameUtils";

export default {
  name: "InicioView",
  data() { return {
    featured: { id: "", name: "Carregando catálogo…", originalName: "GAME ATLAS", year: "", tagline: "Preparando a próxima aventura.", genres: [], cover: "" },
    recommendations: [],
    allGames: [],
    totalReviews: 0,
    dataSources: ["API Game Atlas", "Banco de dados MySQL", "Steam Web API"],
    apiStatus: "CONECTANDO À API",
    discoveryLinks: [
      { label: "Mundos abertos", query: "Mundo aberto", symbol: "◎" },
      { label: "RPGs memoráveis", query: "RPG", symbol: "✳" },
      { label: "Jogar em dupla", query: "Cooperativo", symbol: "↗" },
      { label: "Monster Hunter", query: "Monster Hunter", symbol: "◈" }
    ]
  };
  },
  computed: {
    catalogCount() { return this.allGames.length; },
    ratedCount() { return this.allGames.filter((game) => game.communityReview).length; },
    videoCount() { return this.allGames.filter((game) => game.videos.length).length; },
    formattedReviewCount() { return new Intl.NumberFormat("pt-BR", { notation: this.totalReviews > 999999 ? "compact" : "standard", maximumFractionDigits: 1 }).format(this.totalReviews); }
  },
  async created() {
    let catalog = [];
    try {
      const response = await api.get("/wiki/jogos");
      if (Array.isArray(response.data)) catalog = response.data.map(normalizeGame);
      this.apiStatus = "API E BANCO DE DADOS CONECTADOS";
    } catch (error) {
      console.warn("Usando destaques locais: API wiki indisponível.", error.message);
      const { default: localGames } = await import("../data/wikiGames");
      catalog = localGames.map(normalizeGame);
      this.apiStatus = "MODO DE APRESENTAÇÃO LOCAL";
    }
    if (catalog.length) {
      this.allGames = catalog;
      this.featured = catalog.find((game) => game.franchise !== "Monster Hunter") || catalog[0];
      this.recommendations = catalog.filter((game) => game.id !== this.featured.id && game.franchise !== "Monster Hunter").slice(0, 4);
    }
    try {
      const stats = await api.get("/wiki/estatisticas");
      this.totalReviews = stats.data.totalCommunityReviews || 0;
      this.dataSources = stats.data.dataSources || this.dataSources;
    } catch (error) { console.warn("Estatísticas da wiki indisponíveis.", error.message); }
  }
};
</script>
