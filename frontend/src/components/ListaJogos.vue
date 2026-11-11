<template>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Gênero</th>
        <th>Plataforma</th>
        <th>Ano</th>
        <th>Nota</th>
        <th>Status</th>
        <th v-if="ehAdmin">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="jogo in jogos" :key="jogo.id">
        <td>{{ jogo.nome }}</td>
        <td>{{ jogo.genero }}</td>
        <td>{{ jogo.plataforma }}</td>
        <td>{{ jogo.ano_lancamento }}</td>
        <td>{{ jogo.nota }}</td>
        <td>{{ jogo.status }}</td>
        <!-- Editar e Excluir: só o administrador vê -->
        <td v-if="ehAdmin" class="acoes">
          <router-link class="botao-editar" :to="'/jogos/' + jogo.id + '/editar'">
            Editar
          </router-link>
          <button type="button" class="botao-excluir" @click="confirmarExclusao(jogo)">
            Excluir
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { auth } from "../services/auth";

export default {
  name: "ListaJogos",
  props: {
    jogos: { type: Array, required: true }
  },
  emits: ["excluir"],
  computed: {
    ehAdmin() {
      return auth.usuario && auth.usuario.perfil === "admin";
    }
  },
  methods: {
    confirmarExclusao(jogo) {
      if (window.confirm("Excluir o jogo " + jogo.nome + "?")) {
        this.$emit("excluir", jogo.id);
      }
    }
  }
};
</script>