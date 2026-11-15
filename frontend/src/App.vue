<template>
  <TopoCabecalho />
  <main class="wiki-main">
    <router-view />
  </main>
  <RodapeSite />
</template>

<script>
import TopoCabecalho from "./components/TopoCabecalho.vue";
import RodapeSite from "./components/RodapeSite.vue";

export default {
  name: "App",
  components: { TopoCabecalho, RodapeSite }
};
</script>
