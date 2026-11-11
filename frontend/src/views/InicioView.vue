<template>
  <section v-if="auth.usuario" class="cartao">
    <section class="boas-vindas">
      <h2>Olá, {{ auth.usuario.nome }}!</h2>
      <p>Bem-vindo ao Catálogo de Jogos. Aqui você acompanha a biblioteca de jogos.</p>
    </section>

    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <section class="resumo">
      <article class="resumo-item">
        <strong>{{ jogos.length }}</strong>
        <span>Jogos na biblioteca</span>
      </article>
      <article class="resumo-item">
        <strong>{{ contar("Quero jogar") }}</strong>
        <span>Quero jogar</span>
      </article>
      <article class="resumo-item">
        <strong>{{ contar("Jogando") }}</strong>
        <span>Jogando</span>
      </article>
      <article class="resumo-item">
        <strong>{{ contar("Zerado") }}</strong>
        <span>Zerados</span>
      </article>
    </section>

    <h3 class="subtitulo">Melhores notas</h3>
    <p v-if="melhores.length === 0">Ainda não há jogos cadastrados.</p>
    <ol v-else class="ranking">
      <li v-for="jogo in melhores" :key="jogo.id">
        <span>{{ jogo.nome }} <small>({{ jogo.genero }})</small></span>
        <strong>{{ jogo.nota }}</strong>
      </li>
    </ol>

    <router-link class="botao-editar" to="/jogos">Ver biblioteca completa</router-link>
  </section>
</template>

<script>
import api from "../services/axiosInstance";
import { auth, mensagemErro } from "../services/auth";

export default {
  name: "InicioView",
  data() {
    return {
      auth,
      jogos: [],
      erro: ""
    };
  },
  computed: {
    // os 3 jogos com maior nota
    melhores() {
      return [...this.jogos]
        .sort((a, b) => b.nota - a.nota)
        .slice(0, 3);
    }
  },
  async created() {
    try {
      const resposta = await api.get("/jogos");
      this.jogos = resposta.data;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
  },
  methods: {
    contar(status) {
      return this.jogos.filter((jogo) => jogo.status === status).length;
    }
  }
};
</script>