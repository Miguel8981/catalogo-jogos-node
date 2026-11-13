<template>
  <section class="cartao">
    <h2>{{ editando ? "Editar jogo" : "Cadastrar jogo" }}</h2>

    <p v-if="erro" class="aviso erro">{{ erro }}</p>

    <form @submit.prevent="salvar">
      <label>Nome do jogo
        <input type="text" v-model="jogo.nome" maxlength="100" required>
      </label>

      <label>Plataforma
        <input
          type="text"
          v-model="jogo.plataforma"
          maxlength="50"
          placeholder="PC, PlayStation, Xbox..."
          required
        >
      </label>

      <label>Gênero
        <select v-model="jogo.id_genero" required>
          <option value="">Selecione</option>
          <option v-for="genero in generos" :key="genero.id" :value="genero.id">
            {{ genero.nome }}
          </option>
        </select>
      </label>

      <section class="linha">
        <label>Ano de lançamento
          <input type="number" v-model="jogo.ano_lancamento" min="1950" max="2100" required>
        </label>

        <label>Nota (0 a 10)
          <input type="number" v-model="jogo.nota" min="0" max="10" step="0.1" required>
        </label>
      </section>

      <label>Status
        <select v-model="jogo.status">
          <option v-for="s in statusLista" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>

      <label>Foto do jogo (JPG, PNG ou WEBP, até 2 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="escolherFoto">
      </label>

      <!-- Prévia: a foto escolhida agora ou, na edição, a foto atual do jogo -->
      <img v-if="previa" class="previa-foto" :src="previa" alt="Prévia da foto">

      <section class="linha">
        <button type="submit">{{ editando ? "Salvar alterações" : "Cadastrar" }}</button>
        <router-link class="botao-cancelar" to="/jogos">Cancelar</router-link>
      </section>
    </form>
  </section>
</template>

<script>
import api from "../services/axiosInstance";
import { urlImagem } from "../services/axiosInstance";
import { mensagemErro } from "../services/auth";

export default {
  name: "JogoFormView",
  // "id" chega da rota /jogos/:id/editar (props: true). No cadastro fica vazio.
  props: {
    id: { type: String, default: "" }
  },
  data() {
    return {
      jogo: {
        nome: "",
        plataforma: "",
        id_genero: "",
        ano_lancamento: "",
        nota: "",
        status: "Quero jogar"
      },
      foto: null,        // arquivo escolhido no input
      previaNova: "",    // endereço temporário da foto escolhida (para a prévia)
      generos: [],
      statusLista: ["Quero jogar", "Jogando", "Zerado"],
      erro: ""
    };
  },
  computed: {
    editando() {
      return this.id !== "";
    },
    previa() {
      return this.previaNova || urlImagem(this.jogo.imagem);
    }
  },
  async created() {
    try {
      const resposta = await api.get("/generos");
      this.generos = resposta.data;

      if (this.editando) {
        const jogoBanco = await api.get("/jogos/" + this.id);
        this.jogo = jogoBanco.data;
      }
    } catch (e) {
      if (e.response && e.response.status === 404) {
        this.$router.push("/jogos");
        return;
      }
      this.erro = mensagemErro(e);
    }
  },
  methods: {
    escolherFoto(evento) {
      this.foto = evento.target.files[0] || null;
      this.previaNova = this.foto ? URL.createObjectURL(this.foto) : "";
    },
    // Com foto, o envio é multipart/form-data (FormData), não JSON.
    montarFormulario() {
      const dados = new FormData();
      dados.append("nome", this.jogo.nome);
      dados.append("plataforma", this.jogo.plataforma);
      dados.append("id_genero", this.jogo.id_genero);
      dados.append("ano_lancamento", this.jogo.ano_lancamento);
      dados.append("nota", this.jogo.nota);
      dados.append("status", this.jogo.status);
      if (this.foto) {
        dados.append("imagem", this.foto);
      }
      return dados;
    },
    async salvar() {
      this.erro = "";
      try {
        if (this.editando) {
          await api.put("/jogos/" + this.id, this.montarFormulario());
          this.$router.push({
            path: "/jogos",
            query: { msg: "Jogo atualizado com sucesso!" }
          });
        } else {
          await api.post("/jogos", this.montarFormulario());
          this.$router.push({
            path: "/jogos",
            query: { msg: "Jogo cadastrado com sucesso!" }
          });
        }
      } catch (e) {
        this.erro = mensagemErro(e);
      }
    }
  }
};
</script>