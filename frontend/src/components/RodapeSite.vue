<template>
  <footer class="wiki-footer">
    <div class="footer-brand"><GameAtlasLogo compact /><div><strong>GAME ATLAS</strong><p>Um guia para explorar mundos.</p></div></div>
    <p class="footer-note">FICHAS, HISTÓRIAS E GUIAS PARA QUEM AMA JOGAR.</p>
    <router-link to="/catalogo">Explorar o catálogo <span>→</span></router-link>
  </footer>
</template>

<script>
import GameAtlasLogo from "./GameAtlasLogo.vue";

export default { name: "RodapeSite", components: { GameAtlasLogo } };
</script>
