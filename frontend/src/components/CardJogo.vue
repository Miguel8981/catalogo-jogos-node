<template>
  <article class="card-jogo">
    <!-- Clicar na foto ou no nome abre a tela de detalhes do jogo -->
    <router-link class="card-link" :to="'/catalogo/' + jogo.id">
      <img v-if="jogo.imagem" class="card-foto" :src="foto" :alt="'Capa de ' + jogo.nome">
      <section v-else class="card-foto card-sem-foto">Sem foto</section>
    </router-link>

    <section class="card-corpo">
      <h3>
        <router-link class="card-link" :to="'/catalogo/' + jogo.id">{{ jogo.nome }}</router-link>
      </h3>
      <p class="card-avaliacao">
        <span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}
        <small>/ 10</small>
      </p>

      <p v-if="naBiblioteca" class="card-comprado">✓ Na sua biblioteca</p>
      <button v-else type="button" @click="$emit('adicionar', jogo)">Adicionar à minha biblioteca</button>
    </section>
  </article>
</template>

<script>
import { urlImagem } from "../services/axiosInstance";

export default {
  name: "CardJogo",
  props: {
    jogo: { type: Object, required: true },
    naBiblioteca: { type: Boolean, default: false }
  },
  emits: ["adicionar"],
  computed: {
    foto() {
      return urlImagem(this.jogo.imagem);
    }
  }
};
</script>