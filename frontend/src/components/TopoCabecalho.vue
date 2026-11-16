<template>
  <header class="wiki-topbar">
    <div class="topbar-inner">
      <router-link class="wiki-brand" to="/inicio" aria-label="Game Atlas, página inicial"><GameAtlasLogo /></router-link>
      <nav class="wiki-nav" aria-label="Navegação principal">
        <router-link to="/inicio">Descobrir</router-link>
        <router-link to="/catalogo">Catálogo</router-link>
        <router-link :to="{ path: '/catalogo', query: { sort: 'comunidade' } }">Mais avaliados</router-link>
      </nav>
      <form class="topbar-search" role="search" @submit.prevent="buscar">
        <span>⌕</span><input v-model="termo" type="search" placeholder="Buscar na wiki" aria-label="Buscar jogos"><kbd>↵</kbd>
      </form>
      <div class="topbar-account">
        <router-link v-if="auth.usuario" class="account-link" to="/perfil">{{ auth.usuario.nome }}</router-link>
        <a v-if="auth.usuario" href="#" class="account-link account-exit" @click.prevent="sairDaConta">Sair</a>
        <router-link v-else class="account-link" to="/login">Entrar <span>↗</span></router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { auth, sair } from "../services/auth";
import GameAtlasLogo from "./GameAtlasLogo.vue";

export default {
  name: "TopoCabecalho",
  components: { GameAtlasLogo },
  data() { return { auth, termo: "" }; },
  methods: {
    buscar() {
      this.$router.push({ path: "/catalogo", query: this.termo.trim() ? { q: this.termo.trim() } : {} });
    },
    async sairDaConta() {
      await sair();
      this.$router.push("/inicio");
    }
  }
};
</script>
