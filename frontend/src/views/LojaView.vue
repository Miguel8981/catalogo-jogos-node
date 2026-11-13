<template>
  <section class="cartao cartao-largo">
    <h2>Loja de jogos</h2>

    <p v-if="msg" class="aviso sucesso">{{ msg }}</p>
    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <p v-if="jogos.length === 0 && !erro">Nenhum jogo disponível na loja ainda.</p>

    <section v-else class="grade-cards">
      <CardJogo
        v-for="jogo in jogos"
        :key="jogo.id"
        :jogo="jogo"
        :comprado="comprados.includes(jogo.id)"
        @comprar="comprarJogo"
      />
    </section>
  </section>
</template>

<script>
import CardJogo from "../components/CardJogo.vue";
import api from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "LojaView",
  components: { CardJogo },
  data() {
    return {
      jogos: [],
      comprados: [],   // ids dos jogos que o usuário já comprou
      msg: "",
      erro: ""
    };
  },
  async created() {
    try {
      const jogos = await api.get("/jogos");
      this.jogos = jogos.data;

      const compras = await api.get("/compras");
      this.comprados = compras.data;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
  },
  methods: {
    async comprarJogo(jogo) {
      this.msg = "";
      this.erro = "";

      if (!window.confirm("Comprar o jogo " + jogo.nome + "?")) {
        return;
      }

      try {
        const resposta = await api.post("/compras/" + jogo.id);
        this.comprados.push(jogo.id);
        this.msg = resposta.data.msg;
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>