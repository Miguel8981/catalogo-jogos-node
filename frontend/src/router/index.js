import { createRouter, createWebHistory } from "vue-router";
import { auth, carregarSessao, paginaInicial } from "../services/auth";
const routes = [
  { path: "/", redirect: "/inicio" },
  { path: "/login", component: () => import("../views/LoginView.vue"), meta: { publica: true } },
  { path: "/cadastro", component: () => import("../views/CadastroView.vue"), meta: { publica: true } },
  { path: "/inicio", component: () => import("../views/InicioView.vue"), meta: { wiki: true } },
  { path: "/admin/cadastro", component: () => import("../views/CadastroAdminView.vue"), meta: { admin: true } },
  { path: "/perfil", component: () => import("../views/PerfilView.vue") },
  { path: "/catalogo", component: () => import("../views/CatalogoView.vue"), meta: { wiki: true } },
  { path: "/catalogo/:id", component: () => import("../views/JogoDetalheView.vue"), props: true, meta: { wiki: true } },
  { path: "/biblioteca", component: () => import("../views/MinhaBibliotecaView.vue") },
  { path: "/jogos", component: () => import("../views/BibliotecaView.vue") },
  { path: "/jogos/novo", component: () => import("../views/JogoFormView.vue"), meta: { admin: true } },
  { path: "/jogos/:id/editar", component: () => import("../views/JogoFormView.vue"), props: true, meta: { admin: true } }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  }
});

// Guarda de rotas: faz o papel dos middlewares exigirLogin / exigirAdmin no front.
// (A proteção de verdade continua na API; aqui é só para navegar melhor.)
router.beforeEach(async (to) => {
  if (to.meta.wiki) {
    return true;
  }

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
