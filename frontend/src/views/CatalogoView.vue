<template>
  <section class="cartao cartao-largo">
    <h2>Catálogo de jogos</h2>

    <p v-if="msg" class="aviso sucesso">{{ msg }}</p>
    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <p v-if="jogos.length === 0 && !erro">Nenhum jogo disponível no catálogo ainda.</p>

    <section v-else class="grade-cards">
      <CardJogo
        v-for="jogo in jogos"
        :key="jogo.id"
        :jogo="jogo"
        :na-biblioteca="adicionados.includes(jogo.id)"
        @adicionar="adicionarJogo"
      />
    </section>
  </section>
</template>

<script>
import CardJogo from "../components/CardJogo.vue";
import api from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "CatalogoView",
  components: { CardJogo },
  data() {
    return {
      jogos: [],
      adicionados: [],   // ids dos jogos que o usuário já adicionou à biblioteca
      msg: "",
      erro: ""
    };
  },
  async created() {
    try {
      const jogos = await api.get("/jogos");
      this.jogos = jogos.data;

      const adicionados = await api.get("/compras");
      this.adicionados = adicionados.data;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
  },
  methods: {
    async adicionarJogo(jogo) {
      this.msg = "";
      this.erro = "";

      try {
        const resposta = await api.post("/compras/" + jogo.id);
        this.adicionados.push(jogo.id);
        this.msg = resposta.data.msg;
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>