<template>
  <section class="cartao cartao-largo">
    <router-link class="voltar" to="/loja">← Voltar para a loja</router-link>

    <p v-if="msg" class="aviso sucesso">{{ msg }}</p>
    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <section v-if="jogo" class="detalhe">
      <img v-if="jogo.imagem" class="detalhe-foto" :src="foto" :alt="'Capa de ' + jogo.nome">
      <section v-else class="detalhe-foto card-sem-foto">Sem foto</section>

      <section class="detalhe-info">
        <h2>{{ jogo.nome }}</h2>

        <p class="card-avaliacao">
          <span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}
          <small>/ 10</small>
        </p>

        <dl class="detalhe-lista">
          <dt>Gênero</dt>
          <dd>{{ jogo.genero }}</dd>
          <dt>Plataforma</dt>
          <dd>{{ jogo.plataforma }}</dd>
          <dt>Ano de lançamento</dt>
          <dd>{{ jogo.ano_lancamento }}</dd>
        </dl>

        <p v-if="comprado" class="card-comprado">✓ Você já comprou este jogo</p>
        <button v-else type="button" @click="comprar">Comprar</button>

        <h3 class="subtitulo">Meu status</h3>
        <section class="status-opcoes">
          <button
            v-for="opcao in opcoes"
            :key="opcao"
            type="button"
            class="botao-status"
            :class="{ ativo: status === opcao }"
            :disabled="bloqueado(opcao)"
            @click="definirStatus(opcao)"
          >
            {{ opcao }}
          </button>
        </section>
        <p v-if="!comprado" class="dica">
          Compre o jogo para poder marcá-lo como Jogando ou Zerado.
        </p>
      </section>
    </section>
  </section>
</template>

<script>
import api, { urlImagem } from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "JogoDetalheView",
  // "id" chega da rota /loja/:id (props: true)
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      jogo: null,
      comprado: false,
      status: null,
      opcoes: ["Quero jogar", "Jogando", "Zerado"],
      msg: "",
      erro: ""
    };
  },
  computed: {
    foto() {
      return urlImagem(this.jogo.imagem);
    }
  },
  async created() {
    try {
      const resposta = await api.get("/loja/" + this.id);
      this.jogo = resposta.data.jogo;
      this.comprado = resposta.data.comprado;
      this.status = resposta.data.status;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        this.erro = "Jogo não encontrado. Se ele existe, reinicie o backend (node app.js).";
        return;
      }
      this.erro = mensagemErro(e);
    }
  },
  methods: {
    // Jogando e Zerado ficam travados até a compra.
    bloqueado(opcao) {
      return !this.comprado && opcao !== "Quero jogar";
    },
    async comprar() {
      this.msg = "";
      this.erro = "";
      if (!window.confirm("Comprar o jogo " + this.jogo.nome + "?")) {
        return;
      }
      try {
        const resposta = await api.post("/compras/" + this.id);
        this.comprado = true;
        this.msg = resposta.data.msg;
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    },
    async definirStatus(opcao) {
      this.msg = "";
      this.erro = "";
      try {
        const resposta = await api.put("/loja/" + this.id + "/status", { status: opcao });
        this.status = resposta.data.status;
        this.msg = resposta.data.msg;
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>