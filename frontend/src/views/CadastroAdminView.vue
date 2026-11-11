<template>
  <FormUsuario
    titulo="Cadastrar administrador"
    voltar="/jogos"
    :erro="erro"
    @enviar="cadastrar"
  />
</template>

<script>
import FormUsuario from "../components/FormUsuario.vue";
import api from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "CadastroAdminView",
  components: { FormUsuario },
  data() {
    return { erro: "" };
  },
  methods: {
    async cadastrar(dados) {
      this.erro = "";
      try {
        await api.post("/admin/cadastro", dados);
        this.$router.push({
          path: "/jogos",
          query: { msg: "Administrador cadastrado com sucesso!" }
        });
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>