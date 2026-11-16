<template>
  <div v-if="game" class="wiki-page detail-page">
    <nav class="breadcrumbs" aria-label="Caminho"><router-link to="/inicio">Início</router-link><span>/</span><router-link to="/catalogo">Jogos</router-link><span>/</span><strong>{{ game.name }}</strong></nav>

    <section class="detail-hero" :style="{ '--detail-image': `url(${game.cover})` }">
      <div class="detail-poster"><img :src="game.cover" :alt="`Capa de ${game.name}`"></div>
      <div class="detail-overview">
        <span class="eyebrow">FICHA DO JOGO · {{ game.year }}</span>
        <p class="detail-original">{{ game.originalName }}</p>
        <h1>{{ game.name }}</h1>
        <p class="detail-tagline">{{ game.tagline }}</p>
        <div class="hero-tags"><span v-for="genre in game.genres" :key="genre">{{ genre }}</span></div>
        <p class="detail-description">{{ game.description }}</p>
        <div class="detail-actions"><a v-if="game.videos.length" href="#videos" class="primary-link">▶ <span>Ver trailers e gameplay</span></a><a href="#ficha" class="outline-link">Ver ficha técnica <span>↓</span></a></div>
      </div>
      <div class="detail-rating" :class="{ 'detail-rating-empty': !game.score || game.score === '—' }"><strong>{{ game.score && game.score !== '—' ? game.score : '—' }}</strong><span>{{ game.score && game.score !== '—' ? 'METASCORE' : 'SEM NOTA' }}</span><small v-if="game.score && game.score !== '—'">de 100</small></div>
    </section>

    <section id="ficha" class="detail-facts">
      <div class="fact-cell"><span>LANÇAMENTO</span><strong>{{ game.releaseDate }}</strong></div>
      <div class="fact-cell"><span>DESENVOLVEDORA</span><strong>{{ game.developer }}</strong></div>
      <div class="fact-cell"><span>DISTRIBUIDORA</span><strong>{{ game.publisher }}</strong></div>
      <div class="fact-cell"><span>MODOS</span><strong>{{ game.modes.join(" · ") }}</strong></div>
      <div class="fact-cell fact-platforms"><span>PLATAFORMAS</span><strong>{{ game.platforms.join(" · ") }}</strong></div>
    </section>

    <section class="detail-content-grid">
      <div class="detail-main-column">
        <section id="videos" class="detail-section">
          <div class="section-heading"><div><span class="eyebrow">TRAILERS E GAMEPLAY</span><h2>Vídeos do jogo</h2></div><span class="section-count">{{ String(videoIndex + 1).padStart(2, '0') }} / {{ String(game.videos.length).padStart(2, '0') }}</span></div>
          <WikiVideoPlayer v-if="activeVideo" :video="activeVideo" />
          <div v-else class="trailer-empty"><span>▶</span><div><strong>Vídeos em breve</strong><p>Estamos preparando esta seção da ficha.</p></div></div>
          <div v-if="game.videos.length > 1" class="video-rail">
            <button v-for="(video, index) in game.videos" :key="video.id" type="button" class="video-choice" :class="{ active: index === videoIndex }" @click="videoIndex = index">
              <span class="video-thumb"><img :src="video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`" :alt="`Prévia: ${video.title}`"><span>▶</span></span>
              <span class="video-choice-meta"><small>{{ video.kind }}</small><strong>{{ video.title }}</strong></span>
            </button>
          </div>
        </section>

        <section id="galeria" class="detail-section">
          <div class="section-heading"><div><span class="eyebrow">IMAGENS DO JOGO</span><h2>Explore o visual</h2></div><span class="section-count">{{ String(game.screenshots.length).padStart(2, '0') }} IMAGENS</span></div>
          <button v-if="game.screenshots.length" type="button" class="gallery-preview" @click="lightboxAberto = true" :aria-label="`Ampliar imagem ${imageIndex + 1} de ${game.name}`">
            <img :src="game.screenshots[imageIndex]" :alt="`Imagem ${imageIndex + 1} de ${game.name}`">
            <span class="gallery-zoom">⤢ <small>Ampliar</small></span>
            <span class="gallery-counter">{{ String(imageIndex + 1).padStart(2, '0') }} / {{ String(game.screenshots.length).padStart(2, '0') }}</span>
          </button>
          <div v-if="game.screenshots.length > 1" class="gallery-thumbs">
            <button v-for="(image, index) in game.screenshots" :key="image" type="button" :class="{ active: index === imageIndex }" @click="imageIndex = index" :aria-label="`Ver imagem ${index + 1}`"><img :src="image" :alt="`Miniatura ${index + 1}`" loading="lazy"></button>
          </div>
          <p v-if="game.screenshots.length" class="gallery-note">Imagens de divulgação e capturas vinculadas às páginas oficiais dos jogos.</p>
          <div v-else class="specs-pending"><span>◌</span> Galeria de imagens em atualização.</div>
        </section>

        <section id="avaliacoes" class="detail-section community-section">
          <div class="section-heading"><div><span class="eyebrow">VOZ DA COMUNIDADE</span><h2>O que os jogadores acharam?</h2></div><span v-if="game.communityReview" class="community-source-label">DADOS DA STEAM</span></div>
          <div v-if="game.communityReview" class="community-review-card">
            <div class="community-score-panel">
              <span class="community-score-kicker">RECOMENDAÇÃO DOS JOGADORES</span>
              <strong class="community-score-number">{{ game.communityReview.recommendPercent }}<small>%</small></strong>
              <span class="community-score-label">{{ game.communityReview.scoreLabel }}</span>
              <div class="community-score-track"><i :style="{ width: `${game.communityReview.recommendPercent}%` }"></i></div>
              <span class="community-score-caption">das avaliações recomendam este jogo</span>
            </div>
            <div class="community-review-body">
              <div class="community-review-head">
                <div><span class="eyebrow">TERMÔMETRO DA COMUNIDADE</span><p>Opiniões de jogadores na Steam, em todos os idiomas.</p></div>
                <strong>{{ formatarNumero(game.communityReview.totalReviews) }}<small> avaliações</small></strong>
              </div>
              <div class="community-sentiment-bar" role="img" :aria-label="`${game.communityReview.recommendPercent}% de avaliações positivas`"><i :style="{ width: `${game.communityReview.recommendPercent}%` }"></i></div>
              <div class="community-counts"><span><i class="sentiment-positive"></i>{{ formatarNumero(game.communityReview.positive) }} positivas</span><span><i class="sentiment-negative"></i>{{ formatarNumero(game.communityReview.negative) }} negativas</span></div>
              <div class="community-takeaways">
                <article><span class="takeaway-mark praise-mark">+</span><div><small>O QUE AGRADA</small><p>{{ game.communityReview.praise }}</p></div></article>
                <article><span class="takeaway-mark caveat-mark">−</span><div><small>PONTOS DE ATENÇÃO</small><p>{{ game.communityReview.caveat }}</p></div></article>
              </div>
              <div class="community-review-footer"><span>Resumo consultado em {{ formatarData(game.communityReview.updatedAt) }}. A opinião pode mudar com novas avaliações.</span><a :href="game.communityReview.url" target="_blank" rel="noopener noreferrer">Ler avaliações na Steam <span>↗</span></a></div>
            </div>
          </div>
          <div v-else class="community-unavailable"><span>◌</span><div><strong>Avaliações da comunidade indisponíveis</strong><p>Este jogo não tem uma página de avaliações Steam vinculada à ficha ainda.</p></div></div>
        </section>

        <section class="detail-section expectations-section">
          <div class="section-heading"><div><span class="eyebrow">VISÃO GERAL</span><h2>O que esperar</h2></div><span class="community-source-label">{{ String(game.highlights.length).padStart(2, '0') }} DESTAQUES</span></div>
          <div class="highlights-grid"><article v-for="(item, index) in game.highlights" :key="item"><span class="highlight-number">0{{ index + 1 }}</span><span class="highlight-arrow">↗</span><p>{{ item }}</p></article></div>
        </section>

        <section id="requisitos" class="detail-section">
          <div class="section-heading"><div><span class="eyebrow">JOGO NO PC</span><h2>Requisitos de sistema</h2></div><span class="section-count">WINDOWS</span></div>
          <div v-if="game.specs" class="specs-table">
            <div class="specs-header"><span>COMPONENTE</span><strong>MÍNIMO</strong><strong>RECOMENDADO</strong></div>
            <div v-for="(label, index) in specLabels" :key="label" class="specs-row"><span>{{ label }}</span><strong>{{ game.specs.min[index] }}</strong><strong>{{ game.specs.recommended[index] }}</strong></div>
          </div>
          <div v-else class="specs-pending"><span>◌</span> Requisitos detalhados em atualização.</div>
          <p class="specs-note">Consulte a página oficial do jogo para confirmar os requisitos da sua plataforma e versão.</p>
        </section>
      </div>

      <aside class="detail-aside">
        <section class="aside-panel"><span class="eyebrow">NA FICHA</span><h3>{{ game.name }}</h3><dl><dt>Lançamento</dt><dd>{{ game.year }}</dd><dt>Gêneros</dt><dd>{{ game.genres.join(", ") }}</dd><dt>Desenvolvedora</dt><dd>{{ game.developer }}</dd><dt>Distribuidora</dt><dd>{{ game.publisher }}</dd></dl></section>
        <section class="aside-note"><span class="eyebrow">SOBRE ESTA WIKI</span><p>Uma ficha de referência para explorar os jogos: do estúdio aos requisitos para jogar.</p><router-link to="/catalogo">Descobrir outros jogos <span>→</span></router-link></section>
      </aside>
    </section>
    <div v-if="lightboxAberto" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="`Galeria de ${game.name}`" @click.self="lightboxAberto = false" @keydown.esc="lightboxAberto = false">
      <button type="button" class="lightbox-close" aria-label="Fechar imagem" @click="lightboxAberto = false">×</button>
      <button v-if="game.screenshots.length > 1" type="button" class="lightbox-arrow previous" aria-label="Imagem anterior" @click="moverImagem(-1)">‹</button>
      <img :src="game.screenshots[imageIndex]" :alt="`Imagem ${imageIndex + 1} de ${game.name}`">
      <button v-if="game.screenshots.length > 1" type="button" class="lightbox-arrow next" aria-label="Próxima imagem" @click="moverImagem(1)">›</button>
      <span class="lightbox-count">{{ imageIndex + 1 }} / {{ game.screenshots.length }}</span>
    </div>
  </div>
  <div v-else-if="isLoading" class="wiki-page detail-loading"><span class="eyebrow"><span class="api-live-dot"></span> CONSULTANDO A API DA WIKI</span><p>Carregando ficha, imagens e informações do jogo…</p></div>
  <div v-else class="wiki-page not-found"><span class="eyebrow">FICHA NÃO ENCONTRADA</span><h1>Esse jogo ainda não entrou no catálogo.</h1><router-link class="primary-link" to="/catalogo">Voltar ao catálogo <span>→</span></router-link></div>
</template>

<script>
import api from "../services/axiosInstance";
import { normalizeGame } from "../data/wikiGameUtils";
import WikiVideoPlayer from "../components/WikiVideoPlayer.vue";

export default {
  name: "JogoDetalheView",
  components: { WikiVideoPlayer },
  props: { id: { type: String, required: true } },
  data() { return { game: null, isLoading: true, videoIndex: 0, imageIndex: 0, lightboxAberto: false, specLabels: ["Sistema operacional", "Processador", "Memória", "Placa de vídeo", "Armazenamento"] }; },
  async created() { await this.carregarJogo(this.id); },
  computed: { activeVideo() { return this.game && this.game.videos[this.videoIndex]; } },
  watch: { id(value) { this.carregarJogo(value); this.videoIndex = 0; this.imageIndex = 0; this.lightboxAberto = false; } },
  methods: {
    formatarNumero(valor) { return new Intl.NumberFormat("pt-BR").format(valor || 0); },
    formatarData(valor) { return valor ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(valor)) : "data não informada"; },
    async carregarJogo(id) {
      this.game = null;
      this.isLoading = true;
      try {
        const response = await api.get(`/wiki/jogos/${encodeURIComponent(id)}`);
        this.game = normalizeGame(response.data);
      } catch (error) {
        console.warn("Usando ficha local: API wiki indisponível.", error.message);
        const { default: localGames } = await import("../data/wikiGames");
        this.game = localGames.find((item) => item.id === id) || null;
      } finally { this.isLoading = false; }
    },
    moverImagem(delta) { this.imageIndex = (this.imageIndex + delta + this.game.screenshots.length) % this.game.screenshots.length; }
  }
};
</script>
