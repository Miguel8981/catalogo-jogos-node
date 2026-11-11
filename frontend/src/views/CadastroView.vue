<template>
  <FormUsuario
    titulo="Criar conta"
    voltar="/login"
    :erro="erro"
    @enviar="cadastrar"
  />
</template>

<script>
import FormUsuario from "../components/FormUsuario.vue";
import api from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "CadastroView",
  components: { FormUsuario },
  data() {
    return { erro: "" };
  },
  methods: {
    async cadastrar(dados) {
      this.erro = "";
      try {
        await api.post("/cadastro", dados);
        this.$router.push({
          path: "/login",
          query: { msg: "Conta criada! Faça login." }
        });
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>