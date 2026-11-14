<template>
  <section class="secao-jogos">
    <h3 class="secao-jogos-titulo">{{ titulo }}</h3>

    <p v-if="jogos.length === 0" class="nota">{{ vazio }}</p>

    <section v-else class="grade-mini">
      <router-link
        v-for="jogo in jogos"
        :key="jogo.id"
        class="mini-card"
        :to="'/catalogo/' + jogo.id"
      >
        <img v-if="jogo.imagem" class="mini-foto" :src="foto(jogo)" :alt="'Capa de ' + jogo.nome">
        <section v-else class="mini-foto card-sem-foto">Sem foto</section>

        <section class="mini-corpo">
          <strong class="mini-nome">{{ jogo.nome }}</strong>
          <span class="mini-nota"><span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}</span>
          <small v-if="jogo.total" class="nota">
            {{ Number(jogo.total) }} {{ Number(jogo.total) === 1 ? singular : plural }}
          </small>
        </section>
      </router-link>
    </section>
  </section>
</template>

<script>
import { urlImagem } from "../services/axiosInstance";

export default {
  name: "SecaoJogos",
  props: {
    titulo: { type: String, required: true },
    jogos: { type: Array, required: true },
    vazio: { type: String, default: "Nenhum jogo por aqui ainda." },
    singular: { type: String, default: "" },   // ex.: "adição"
    plural: { type: String, default: "" }      // ex.: "adições"
  },
  methods: {
    foto(jogo) {
      return urlImagem(jogo.imagem);
    }
  }
};
</script>