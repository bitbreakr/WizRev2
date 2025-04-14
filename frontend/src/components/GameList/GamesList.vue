<script setup lang="ts">
import type { Game } from "../../api";
import GameListItem from "./GameListItem.vue";
import { ref } from "vue";
import GameModal from "../GameModal.vue";
import { useStore } from "vuex";

const { games } = defineProps<{
  games: Game[];
}>();
const emit = defineEmits<{
  (e: "onEmptyStateClick"): void;
}>();

const store = useStore();
const showModal = ref<boolean>(false);
const selectedGame = ref<Game | undefined>(undefined);

const setSelectedGame = (gameId: string): void => {
  const foundGame = games.find((cursor) => cursor.id === gameId);
  if (foundGame) {
    selectedGame.value = foundGame;
    showModal.value = true;
  }
};

const handleUpdateGame = (game: Game): void => {
  store.dispatch("games/updateGame", game);
};

const handleDeleteGame = (game: Game): void => {
  store.dispatch("games/deleteGame", game);
  showModal.value = false;
};
</script>
<template>
  <GameModal
    v-if="showModal"
    :game="selectedGame"
    @onSubmit="handleUpdateGame"
    @onDelete="handleDeleteGame"
    @onClose="showModal = false"
  />
  <template v-if="!games.length">
    <div class="blankslate mw-100">
      <h4>No games found</h4>
      <p>
        You don't have any games registered yet. Submit your first game to get
        started.
      </p>
      <div class="blankslate-actions">
        <button
          class="btn btn-primary"
          type="button"
          @click="emit('onEmptyStateClick')"
        >
          Submit a game
        </button>
      </div>
    </div>
  </template>
  <template v-else>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Platform</th>
          <th scope="col">Name</th>
          <th scope="col">Version</th>
        </tr>
      </thead>
      <tbody>
        <GameListItem
          v-for="(game, idx) in games"
          :game="game"
          :key="idx"
          @setSelectedGameId="setSelectedGame"
        />
      </tbody>
    </table>
  </template>
</template>
