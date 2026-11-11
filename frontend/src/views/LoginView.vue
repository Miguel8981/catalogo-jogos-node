<template>
  <section class="cartao cartao-estreito">
    <h2>Entrar</h2>

    <p v-if="msg" class="aviso sucesso">{{ msg }}</p>
    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <form @submit.prevent="entrarNaConta">
      <label>E-mail
        <input type="email" v-model="email" required>
      </label>

      <label>Senha
        <input type="password" v-model="senha" required>
      </label>

      <section class="linha">
        <button type="submit">Entrar</button>
        <router-link class="botao-cancelar" to="/cadastro">Criar conta</router-link>
      </section>
    </form>
  </section>
</template>

<script>
import { entrar, mensagemErro, paginaInicial } from "../services/auth";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      senha: "",
      erro: "",
      msg: this.$route.query.msg || ""
    };
  },
  methods: {
    async entrarNaConta() {
      this.erro = "";
      this.msg = "";
      try {
        await entrar(this.email, this.senha);
        this.$router.push(paginaInicial());
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>