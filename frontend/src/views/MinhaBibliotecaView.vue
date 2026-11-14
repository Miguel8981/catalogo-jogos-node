<template>
  <section class="cartao cartao-largo">
    <h2>Minha biblioteca</h2>

    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <!-- Biblioteca vazia -->
    <section v-if="carregado && jogos.length === 0 && !erro" class="vazio">
      <p>Sua biblioteca ainda está vazia.</p>
      <router-link class="botao-editar" to="/catalogo">Explorar o catálogo</router-link>
    </section>

    <template v-if="jogos.length > 0">
      <!-- Filtro por status -->
      <section class="status-opcoes filtro-biblioteca">
        <button
          v-for="aba in abas"
          :key="aba"
          type="button"
          class="botao-status"
          :class="{ ativo: filtro === aba }"
          @click="filtro = aba"
        >
          {{ aba }} ({{ contar(aba) }})
        </button>
      </section>

      <p v-if="filtrados.length === 0" class="nota">Nenhum jogo com este status.</p>

      <section v-else class="grade-mini">
        <router-link
          v-for="jogo in filtrados"
          :key="jogo.id"
          class="mini-card"
          :to="'/catalogo/' + jogo.id"
        >
          <img v-if="jogo.imagem" class="mini-foto" :src="foto(jogo)" :alt="'Capa de ' + jogo.nome">
          <section v-else class="mini-foto card-sem-foto">Sem foto</section>

          <section class="mini-corpo">
            <strong class="mini-nome">{{ jogo.nome }}</strong>
            <span class="mini-nota"><span class="estrela">★</span> {{ Number(jogo.nota).toFixed(1) }}</span>
            <span class="selo-status" :class="classeStatus(jogo.status)">
              {{ jogo.status || "Sem status" }}
            </span>
          </section>
        </router-link>
      </section>
    </template>
  </section>
</template>

<script>
import api, { urlImagem } from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "MinhaBibliotecaView",
  data() {
    return {
      jogos: [],
      abas: ["Todos", "Quero jogar", "Jogando", "Zerado"],
      filtro: "Todos",
      carregado: false,
      erro: ""
    };
  },
  computed: {
    filtrados() {
      if (this.filtro === "Todos") {
        return this.jogos;
      }
      return this.jogos.filter((jogo) => jogo.status === this.filtro);
    }
  },
  async created() {
    try {
      const resposta = await api.get("/biblioteca");
      this.jogos = resposta.data;
    } catch (e) {
      this.erro = mensagemErro(e);
    }
    this.carregado = true;
  },
  methods: {
    foto(jogo) {
      return urlImagem(jogo.imagem);
    },
    contar(aba) {
      if (aba === "Todos") {
        return this.jogos.length;
      }
      return this.jogos.filter((jogo) => jogo.status === aba).length;
    },
    classeStatus(status) {
      if (status === "Quero jogar") return "s-quero";
      if (status === "Jogando") return "s-jogando";
      if (status === "Zerado") return "s-zerado";
      return "";
    }
  }
};
</script>