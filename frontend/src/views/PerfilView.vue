<template>
  <section class="perfil-pagina">
    <p v-if="erroGeral" class="aviso erro">{{ erroGeral }}</p>

    <template v-if="perfil">
      <!-- Cabeçalho: avatar com iniciais, nome e tipo da conta -->
      <section class="perfil-cabecalho">
        <section class="avatar">{{ iniciais }}</section>
        <section class="perfil-dados">
          <h2>{{ perfil.nome }}</h2>
          <span class="selo" :class="{ 'selo-admin': perfil.perfil === 'admin' }">
            ✓ {{ perfil.perfil === "admin" ? "Administrador" : "Usuário" }}
          </span>
        </section>
      </section>

      <!-- Dados da conta (somente leitura) -->
      <h3 class="secao-titulo">Dados da conta</h3>
      <section class="lista-conta">
        <article class="linha-conta">
          <span class="rotulo">Nome</span>
          <span class="valor">{{ perfil.nome }}</span>
        </article>
        <article class="linha-conta">
          <span class="rotulo">E-mail</span>
          <span class="valor">{{ perfil.email }}</span>
        </article>
        <article class="linha-conta">
          <span class="rotulo">Senha</span>
          <span class="valor">
            <span class="pontos">••••••••••</span>
            <small class="nota">
              Protegida por hash — não é exibida por segurança.
              <button type="button" class="link-botao" @click="abrirSenha">Alterar senha</button>
            </small>
          </span>
        </article>
        <article class="linha-conta">
          <span class="rotulo">Membro desde</span>
          <span class="valor">{{ membroDesde }}</span>
        </article>
      </section>

      <!-- Editar nome e e-mail -->
      <h3 class="secao-titulo">Editar meus dados</h3>
      <form class="form-perfil" @submit.prevent="salvarDados">
        <p v-if="msgDados" class="aviso sucesso">{{ msgDados }}</p>
        <p v-if="erroDados" class="aviso erro">{{ erroDados }}</p>

        <label>Nome
          <input type="text" v-model="dados.nome" required>
        </label>
        <label>E-mail
          <input type="email" v-model="dados.email" required>
        </label>
        <label>Senha atual
          <input type="password" v-model="dados.senhaAtual" placeholder="Confirme com sua senha atual" autocomplete="current-password" required>
        </label>

        <section class="acoes-form">
          <button type="submit">Salvar alterações</button>
          <small class="nota">A senha atual é obrigatória para confirmar a alteração.</small>
        </section>
      </form>

      <!-- Alterar senha (abre ao clicar em "Alterar senha") -->
      <template v-if="mostrarSenha">
        <h3 class="secao-titulo">Alterar senha</h3>
        <form class="form-perfil" ref="blocoSenha" @submit.prevent="salvarSenha">
          <p v-if="erroSenha" class="aviso erro">{{ erroSenha }}</p>

          <label>Senha atual
            <input type="password" v-model="senha.senhaAtual" autocomplete="current-password" required>
          </label>
          <label>Nova senha (mínimo 6 caracteres)
            <input type="password" v-model="senha.novaSenha" autocomplete="new-password" required>
          </label>
          <label>Confirmar nova senha
            <input type="password" v-model="senha.confirmar" autocomplete="new-password" required>
          </label>

          <section class="acoes-form">
            <button type="submit">Alterar senha</button>
            <button type="button" class="botao-cancelar" @click="mostrarSenha = false">Cancelar</button>
          </section>
        </form>
      </template>
    </template>
  </section>
</template>

<script>
import api from "../services/axiosInstance";
import { auth, mensagemErro } from "../services/auth";

export default {
  name: "PerfilView",
  data() {
    return {
      perfil: null,                                        // dados vindos do banco
      dados: { nome: "", email: "", senhaAtual: "" },      // formulário "Editar meus dados"
      senha: { senhaAtual: "", novaSenha: "", confirmar: "" },
      mostrarSenha: false,
      msgDados: "",
      erroDados: "",
      erroSenha: "",
      erroGeral: ""
    };
  },
  computed: {
    // Primeira letra do primeiro e do último nome (ex.: "Yuri Alberto" -> "YA")
    iniciais() {
      const partes = this.perfil.nome.trim().split(/\s+/);
      const primeira = partes[0].charAt(0);
      const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
      return (primeira + ultima).toUpperCase();
    },
    membroDesde() {
      return new Date(this.perfil.criado_em).toLocaleDateString("pt-BR");
    }
  },
  async created() {
    try {
      const resposta = await api.get("/perfil");
      this.perfil = resposta.data.usuario;
      this.dados.nome = this.perfil.nome;
      this.dados.email = this.perfil.email;
    } catch (e) {
      this.erroGeral = mensagemErro(e);
    }
  },
  methods: {
    abrirSenha() {
      this.mostrarSenha = true;
      this.$nextTick(() => {
        if (this.$refs.blocoSenha) {
          this.$refs.blocoSenha.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    async salvarDados() {
      this.msgDados = "";
      this.erroDados = "";
      try {
        const resposta = await api.put("/perfil", this.dados);
        this.perfil.nome = resposta.data.usuario.nome;
        this.perfil.email = resposta.data.usuario.email;
        auth.usuario = resposta.data.usuario;   // atualiza o nome no cabeçalho
        this.dados.senhaAtual = "";
        this.msgDados = resposta.data.msg;
      } catch (e) {
        this.erroDados = mensagemErro(e);
      }
    },
    async salvarSenha() {
      this.erroSenha = "";
      try {
        const resposta = await api.put("/perfil/senha", this.senha);
        // A API encerrou a sessão: limpa o estado e manda para o login com os dados novos.
        auth.usuario = null;
        this.$router.push({
          path: "/login",
          query: { msg: resposta.data.msg }
        });
      } catch (e) {
        this.erroSenha = mensagemErro(e);
      }
    }
  }
};
</script>