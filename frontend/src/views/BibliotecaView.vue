<template>
  <section class="cartao">
    <h2>Gerenciar jogos</h2>

    <p v-if="msg" class="aviso sucesso">{{ msg }}</p>
    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <form class="filtro" @submit.prevent="carregarJogos">
      <label>Filtrar por gênero
        <select v-model.number="idGenero">
          <option :value="0">Todos</option>
          <option v-for="genero in generos" :key="genero.id" :value="genero.id">
            {{ genero.nome }}
          </option>
        </select>
      </label>
      <button type="submit">Filtrar</button>
      <button type="button" class="botao-limpar" @click="limparFiltro">Limpar</button>
    </form>

    <p v-if="jogos.length === 0">Nenhum jogo encontrado.</p>
    <ListaJogos v-else :jogos="jogos" @excluir="excluirJogo" />
  </section>
</template>

<script>
import ListaJogos from "../components/ListaJogos.vue";
import api from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "BibliotecaView",
  components: { ListaJogos },
  data() {
    return {
      jogos: [],
      generos: [],
      idGenero: 0,
      msg: this.$route.query.msg || "",
      erro: ""
    };
  },
  async created() {
    try {
      const resposta = await api.get("/generos");
      this.generos = resposta.data;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
    await this.carregarJogos();
  },
  methods: {
    async carregarJogos() {
      try {
        const resposta = await api.get("/jogos", {
          params: { genero: this.idGenero }
        });
        this.jogos = resposta.data;
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    },
    async limparFiltro() {
      this.idGenero = 0;
      await this.carregarJogos();
    },
    async excluirJogo(id) {
      this.erro = "";
      try {
        await api.delete("/jogos/" + id);
        this.msg = "Jogo excluído.";
        await this.carregarJogos();
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>