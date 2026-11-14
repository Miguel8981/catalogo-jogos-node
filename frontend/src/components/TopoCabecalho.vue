<template>
  <header>
    <h1>Catálogo de Jogos</h1>
    <nav>
      <template v-if="auth.usuario">
        <router-link to="/inicio">Início</router-link>
        <router-link to="/catalogo">Catálogo</router-link>
        <router-link to="/biblioteca">Minha biblioteca</router-link>

        <!-- Só o administrador enxerga estes links -->
        <template v-if="auth.usuario.perfil === 'admin'">
          <router-link to="/jogos">Gerenciar jogos</router-link>
          <router-link to="/jogos/novo">Cadastrar jogo</router-link>
          <router-link to="/admin/cadastro">Cadastrar admin</router-link>
        </template>

        <!-- O nome do usuário leva para a tela de perfil -->
        <router-link class="usuario-nome" to="/perfil">{{ auth.usuario.nome }} ({{ auth.usuario.perfil }})</router-link>
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