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
      <div class="hero-index"><span>01</span><i></i>06</div>
    </section>

    <section class="home-intro">
      <div>
        <span class="eyebrow">UM UNIVERSO DE JOGOS, EM UM SÓ LUGAR</span>
        <h2>Conheça antes de jogar.</h2>
      </div>
      <p>Descubra histórias, estúdios, plataformas, trailers e o que seu PC precisa para rodar cada jogo.</p>
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
            <span class="wiki-card-score">{{ game.score }}<small> / 100</small></span>
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
import games from "../data/wikiGames";
import api from "../services/axiosInstance";
import { normalizeGame } from "../data/wikiGames";

export default {
  name: "InicioView",
  data() {
    return { featured: games[0], recommendations: games.slice(1, 5) };
  },
  async created() {
    try {
      const response = await api.get("/wiki/jogos");
      if (Array.isArray(response.data) && response.data.length) {
        const catalog = response.data.map(normalizeGame);
        this.featured = catalog.find((game) => game.franchise !== "Monster Hunter") || catalog[0];
        this.recommendations = catalog.filter((game) => game.id !== this.featured.id && game.franchise !== "Monster Hunter").slice(0, 4);
      }
    } catch (error) { console.warn("Usando destaques locais: API wiki indisponível.", error.message); }
  }
};
</script>
