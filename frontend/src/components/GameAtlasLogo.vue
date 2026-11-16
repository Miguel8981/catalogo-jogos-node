<template>
  <span class="atlas-logo" :class="{ 'atlas-logo-compact': compact }">
    <svg class="atlas-logo-mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" rx="14" fill="#1a2115" stroke="#52633a" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#c3e86d" stroke-width="1.4" stroke-dasharray="2 3" />
      <path d="M29.8 14.5 25 25l-10.8 8.5L19 23.1l10.8-8.6Z" fill="#c3e86d" />
      <path d="m24.7 24.7 4.3-10.2-10 8.1 5.7 2.1Z" fill="#f0f1e9" />
      <circle cx="24" cy="24" r="2" fill="#10120f" />
    </svg>
    <span class="atlas-logo-type"><strong>GAME</strong><span>ATLAS</span></span>
  </span>
</template>

<script>
export default {
  name: "GameAtlasLogo",
  props: { compact: { type: Boolean, default: false } }
};
</script>
