import { reactive } from "vue";
import api from "./axiosInstance";

// Estado de autenticação compartilhado por todos os componentes.
export const auth = reactive({
  usuario: null,
  carregado: false
});

// Pergunta à API quem está logado (só na primeira vez que o app abre).
export async function carregarSessao() {
  if (auth.carregado) {
    return;
  }
  try {
    const resposta = await api.get("/sessao");
    auth.usuario = resposta.data.usuario;
  } catch (erro) {
    auth.usuario = null;
  }
  auth.carregado = true;
}

export async function entrar(email, senha) {
  const resposta = await api.post("/login", { email, senha });
  auth.usuario = resposta.data.usuario;
}

export async function sair() {
  await api.post("/logout");
  auth.usuario = null;
}

// Extrai a mensagem de erro devolvida pela API (ou uma mensagem padrão).
export function mensagemErro(erro) {
  if (erro.response && erro.response.data && erro.response.data.erro) {
    return erro.response.data.erro;
  }
  return "Não foi possível conectar ao servidor.";
}

// Página para onde cada perfil vai depois do login:
// usuário comum -> tela inicial | admin -> biblioteca (com os botões de gerenciar)
export function paginaInicial() {
  if (auth.usuario && auth.usuario.perfil === "admin") {
    return "/jogos";
  }
  return "/inicio";
}