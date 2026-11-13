<template>
  <article class="card-jogo">
    <!-- Clicar na foto ou no nome abre a tela de detalhes do jogo -->
    <router-link class="card-link" :to="'/loja/' + jogo.id">
      <img v-if="jogo.imagem" class="card-foto" :src="foto" :alt="'Capa de ' + jogo.nome">
      <section v-else class="card-foto card-sem-foto">Sem foto</section>
    </router-link>

    <section class="card-corpo">
      <h3>
        <router-link class="card-link" :to="'/loja/' + jogo.id">{{ jogo.nome }}</router-link>
      </h3>
      <p class="card-avaliacao">
        <span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}
        <small>/ 10</small>
      </p>

      <p v-if="comprado" class="card-comprado">✓ Comprado</p>
      <button v-else type="button" @click="$emit('comprar', jogo)">Comprar</button>
    </section>
  </article>
</template>

<script>
import { urlImagem } from "../services/axiosInstance";

export default {
  name: "CardJogo",
  props: {
    jogo: { type: Object, required: true },
    comprado: { type: Boolean, default: false }
  },
  emits: ["comprar"],
  computed: {
    foto() {
      return urlImagem(this.jogo.imagem);
    }
  }
};
</script>