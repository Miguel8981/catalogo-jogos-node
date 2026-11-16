<template>
  <Transition name="opening">
    <div v-if="showOpening" class="opening-screen" aria-label="Game Atlas" role="status">
      <div class="opening-orbit orbit-one"></div><div class="opening-orbit orbit-two"></div>
      <div class="opening-content"><GameAtlasLogo /><span class="opening-caption">UM UNIVERSO DE JOGOS, EM UM SÓ LUGAR</span><i class="opening-progress"><b></b></i></div>
      <span class="opening-coordinate">ENCICLOPÉDIA INTERATIVA · 2026</span>
    </div>
  </Transition>
  <TopoCabecalho />
  <main class="wiki-main">
    <router-view />
  </main>
  <RodapeSite />
</template>

<script>
import TopoCabecalho from "./components/TopoCabecalho.vue";
import RodapeSite from "./components/RodapeSite.vue";
import GameAtlasLogo from "./components/GameAtlasLogo.vue";

export default {
  name: "App",
  components: { TopoCabecalho, RodapeSite, GameAtlasLogo },
  data() { return { showOpening: false }; },
  mounted() {
    const presentationMode = new URLSearchParams(window.location.search).has("apresentacao");
    if (sessionStorage.getItem("game-atlas-opening-seen") && !presentationMode) return;
    this.showOpening = true;
    window.setTimeout(() => {
      this.showOpening = false;
      sessionStorage.setItem("game-atlas-opening-seen", "true");
    }, 2300);
  }
};
</script>
