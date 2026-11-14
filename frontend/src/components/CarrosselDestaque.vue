<template>
  <section v-if="jogos.length > 0" class="hero" @mouseenter="pausar" @mouseleave="iniciar">
    <article
      v-for="(jogo, i) in jogos"
      :key="jogo.id"
      class="slide"
      :class="{ ativo: i === atual }"
    >
      <img v-if="jogo.imagem" class="slide-fundo" :src="foto(jogo)" alt="">

      <section class="slide-conteudo">
        <section class="slide-texto">
          <span class="slide-etiqueta">Novidades no catálogo</span>
          <h2>{{ jogo.nome }}</h2>
          <p class="slide-meta">{{ jogo.genero }} · {{ jogo.plataforma }} · {{ jogo.ano_lancamento }}</p>
          <p class="card-avaliacao">
            <span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}
            <small>/ 10</small>
          </p>
          <router-link class="botao-editar" :to="'/catalogo/' + jogo.id">Ver jogo</router-link>
        </section>

        <img v-if="jogo.imagem" class="slide-capa" :src="foto(jogo)" :alt="'Capa de ' + jogo.nome">
        <section v-else class="slide-capa card-sem-foto">Sem foto</section>
      </section>
    </article>

    <template v-if="jogos.length > 1">
      <button type="button" class="seta-slide seta-esq" aria-label="Anterior" @click="mover(-1)">‹</button>
      <button type="button" class="seta-slide seta-dir" aria-label="Próximo" @click="mover(1)">›</button>

      <section class="indicadores">
        <button
          v-for="(jogo, i) in jogos"
          :key="jogo.id"
          type="button"
          class="indicador"
          :class="{ ativo: i === atual }"
          :aria-label="'Ir para ' + jogo.nome"
          @click="ir(i)"
        ></button>
      </section>
    </template>
  </section>
</template>

<script>
import { urlImagem } from "../services/axiosInstance";

export default {
  name: "CarrosselDestaque",
  props: {
    jogos: { type: Array, required: true }
  },
  data() {
    return {
      atual: 0,       // posição do slide que está aparecendo
      timer: null
    };
  },
  watch: {
    // Quando a lista chega da API, começa do primeiro slide.
    jogos() {
      this.atual = 0;
      this.iniciar();
    }
  },
  mounted() {
    this.iniciar();
  },
  beforeUnmount() {
    this.pausar();
  },
  methods: {
    foto(jogo) {
      return urlImagem(jogo.imagem);
    },
    mover(passo) {
      const total = this.jogos.length;
      this.atual = (this.atual + passo + total) % total;
    },
    ir(posicao) {
      this.atual = posicao;
    },
    // Troca de slide sozinho a cada 5 segundos (pausa com o mouse em cima).
    iniciar() {
      this.pausar();
      if (this.jogos.length > 1) {
        this.timer = setInterval(() => this.mover(1), 5000);
      }
    },
    pausar() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
};
</script>