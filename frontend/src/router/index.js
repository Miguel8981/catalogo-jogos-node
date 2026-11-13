import { createRouter, createWebHistory } from "vue-router";
import { auth, carregarSessao, paginaInicial } from "../services/auth";
import LoginView from "../views/LoginView.vue";
import CadastroView from "../views/CadastroView.vue";
import CadastroAdminView from "../views/CadastroAdminView.vue";
import InicioView from "../views/InicioView.vue";
import BibliotecaView from "../views/BibliotecaView.vue";
import LojaView from "../views/LojaView.vue";
import JogoDetalheView from "../views/JogoDetalheView.vue";
import JogoFormView from "../views/JogoFormView.vue";

const routes = [
  { path: "/", redirect: "/inicio" },
  { path: "/login", component: LoginView, meta: { publica: true } },
  { path: "/cadastro", component: CadastroView, meta: { publica: true } },
  { path: "/inicio", component: InicioView },
  { path: "/admin/cadastro", component: CadastroAdminView, meta: { admin: true } },
  { path: "/loja", component: LojaView },
  { path: "/loja/:id", component: JogoDetalheView, props: true },
  { path: "/jogos", component: BibliotecaView },
  { path: "/jogos/novo", component: JogoFormView, meta: { admin: true } },
  { path: "/jogos/:id/editar", component: JogoFormView, props: true, meta: { admin: true } }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guarda de rotas: faz o papel dos middlewares exigirLogin / exigirAdmin no front.
// (A proteção de verdade continua na API; aqui é só para navegar melhor.)
router.beforeEach(async (to) => {
  await carregarSessao();

  if (!to.meta.publica && !auth.usuario) {
    return "/login";
  }
  if (to.meta.publica && auth.usuario) {
    return paginaInicial();
  }
  if (to.meta.admin && auth.usuario.perfil !== "admin") {
    return "/inicio";
  }
});

export default router;