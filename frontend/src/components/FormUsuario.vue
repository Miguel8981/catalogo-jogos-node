<template>
  <section class="cartao cartao-estreito">
    <h2>{{ titulo }}</h2>

    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <form @submit.prevent="enviarFormulario">
      <label>Nome
        <input type="text" v-model="nome" maxlength="100" required>
      </label>

      <label>E-mail
        <input type="email" v-model="email" maxlength="100" required>
      </label>

      <label>Senha (mínimo 6 caracteres)
        <input type="password" v-model="senha" minlength="6" required>
      </label>

      <label>Confirmar senha
        <input type="password" v-model="confirmar" minlength="6" required>
      </label>

      <section class="linha">
        <button type="submit">Cadastrar</button>
        <router-link class="botao-cancelar" :to="voltar">Cancelar</router-link>
      </section>
    </form>
  </section>
</template>

<script>
export default {
  name: "FormUsuario",
  props: {
    titulo: { type: String, required: true },
    voltar: { type: String, required: true },
    erro: { type: String, default: "" }
  },
  emits: ["enviar"],
  data() {
    return {
      nome: "",
      email: "",
      senha: "",
      confirmar: ""
    };
  },
  methods: {
    enviarFormulario() {
      this.$emit("enviar", {
        nome: this.nome,
        email: this.email,
        senha: this.senha,
        confirmar: this.confirmar
      });
    }
  }
};
</script>