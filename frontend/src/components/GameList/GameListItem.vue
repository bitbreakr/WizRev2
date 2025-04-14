<script setup lang="ts">
import type { Game } from "../../api";
import PlatformBadge from "../PlatformBadge.vue";

const { game } = defineProps<{
  game: Game;
}>();
</script>
<template>
  <tr @click="$emit('setSelectedGameId', game.id)">
    <td><PlatformBadge :platform="game.platform" /></td>
    <td>{{ game.name }}</td>
    <td>{{ game.appVersion }}</td>
  </tr>
</template>
<style scoped>
tr {
  cursor: pointer;
}
</style>
