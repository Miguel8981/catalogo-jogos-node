import axios from "axios";

// Instância única do axios: centraliza a URL da API para todo o projeto.
// withCredentials envia o cookie da sessão para o back-end Node.
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true
});

// Monta o endereço da foto de um jogo (arquivo salvo em backend/uploads).
// Se o jogo não tem foto, devolve "" para a tela mostrar o aviso "Sem foto".
export function urlImagem(nomeArquivo) {
  if (!nomeArquivo) {
    return "";
  }
  return "http://localhost:3001/uploads/" + nomeArquivo;
}

export default api;
