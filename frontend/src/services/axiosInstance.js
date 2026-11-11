import axios from "axios";

// Instância única do axios: centraliza a URL da API para todo o projeto.
// withCredentials envia o cookie da sessão para o back-end Node.
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

export default api;