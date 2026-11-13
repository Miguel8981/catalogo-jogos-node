<template>
  <header>
    <h1>Catálogo de Jogos</h1>
    <nav>
      <template v-if="auth.usuario">
        <router-link to="/inicio">Início</router-link>
        <router-link to="/loja">Loja</router-link>
        <router-link to="/jogos">Biblioteca</router-link>

        <!-- Só o administrador enxerga estes links -->
        <template v-if="auth.usuario.perfil === 'admin'">
          <router-link to="/jogos/novo">Cadastrar jogo</router-link>
          <router-link to="/admin/cadastro">Cadastrar admin</router-link>
        </template>

        <span class="usuario-nome">{{ auth.usuario.nome }} ({{ auth.usuario.perfil }})</span>
        <a href="#" @click.prevent="sairDaConta">Sair</a>
      </template>
      <template v-else>
        <router-link to="/login">Entrar</router-link>
        <router-link to="/cadastro">Criar conta</router-link>
      </template>
    </nav>
  </header>
</template>

<script>
import { auth, sair } from "../services/auth";

export default {
  name: "TopoCabecalho",
  data() {
    return { auth };
  },
  methods: {
    async sairDaConta() {
      await sair();
      this.$router.push("/login");
    }
  }
};
</script>