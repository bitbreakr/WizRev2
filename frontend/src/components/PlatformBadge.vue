<script setup lang="ts">
import type { Game } from "../api";
import { computed } from "vue";

const { platform } = defineProps<Pick<Game, "platform">>();

const classObject = computed(() => ({
  badge: true,
  "text-capitalize": true,
  "text-bg-primary": platform === "ios",
  "text-bg-success": platform === "android",
}));
</script>
<template>
  <span :class="classObject">{{ platform }}</span>
</template>
