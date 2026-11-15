<template>
  <div class="trailer-frame">
    <video v-if="video && video.provider === 'steam'" ref="player" :poster="video.thumbnail" controls playsinline :aria-label="video.title"></video>
    <iframe v-else-if="video" :src="`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`" :title="video.title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</template>

<script>
import Hls from "hls.js";

export default {
  name: "WikiVideoPlayer",
  props: { video: { type: Object, default: null } },
  data() { return { hls: null }; },
  watch: { video: { immediate: true, handler() { this.$nextTick(this.attachVideo); } } },
  beforeUnmount() { if (this.hls) this.hls.destroy(); },
  methods: {
    attachVideo() {
      if (this.hls) { this.hls.destroy(); this.hls = null; }
      if (!this.video || this.video.provider !== "steam" || !this.video.src || !this.$refs.player) return;
      const player = this.$refs.player;
      if (Hls.isSupported()) { this.hls = new Hls(); this.hls.loadSource(this.video.src); this.hls.attachMedia(player); }
      else if (player.canPlayType("application/vnd.apple.mpegurl")) player.src = this.video.src;
    }
  }
};
</script>
