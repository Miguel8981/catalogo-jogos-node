<template>
  <section v-if="auth.usuario" class="inicio-pagina">
    <h2 class="inicio-ola">Olá, {{ auth.usuario.nome }}!</h2>

    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <!-- Carrossel: 3 novidades do catálogo -->
    <CarrosselDestaque :jogos="novidades" />

    <SecaoJogos
      titulo="Mais adicionados nos últimos 6 meses"
      :jogos="maisComprados"
      singular="adição"
      plural="adições"
      vazio="Nenhum jogo foi adicionado às bibliotecas nos últimos 6 meses."
    />

    <SecaoJogos
      titulo="Recém-cadastrados"
      :jogos="recentes"
      vazio="Ainda não há jogos cadastrados."
    />

    <SecaoJogos
      titulo="Mais jogados"
      :jogos="maisJogados"
      singular="jogador"
      plural="jogadores"
      vazio="Ainda ninguém marcou um jogo como Jogando ou Zerado."
    />
  </section>
</template>

<script>
import CarrosselDestaque from "../components/CarrosselDestaque.vue";
import SecaoJogos from "../components/SecaoJogos.vue";
import api from "../services/axiosInstance";
import { auth, mensagemErro } from "../services/auth";

export default {
  name: "InicioView",
  components: { CarrosselDestaque, SecaoJogos },
  data() {
    return {
      auth,
      novidades: [],
      maisComprados: [],
      recentes: [],
      maisJogados: [],
      erro: ""
    };
  },
  async created() {
    try {
      const resposta = await api.get("/loja/destaques");
      this.novidades = resposta.data.novidades;
      this.maisComprados = resposta.data.maisComprados;
      this.recentes = resposta.data.recentes;
      this.maisJogados = resposta.data.maisJogados;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
  }
};
</script>