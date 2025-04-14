<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import GamesList from "./components/GameList/GamesList.vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import Section from "./components/Section.vue";
import GameModal from "./components/GameModal.vue";
import { type Game, type Pagination, populateGames } from "./api";
import NotificationsFeed from "./components/NotificationsFeed.vue";

const store = useStore();
const showModal = ref<boolean>(false);
const currentPage = ref<number>(1); // Track the current page

const paginate = (pagination: Pick<Pagination, "pageSize">) => {
  const pageSize = pagination.pageSize || 25;
  currentPage.value += 1;

  store.dispatch("games/loadGames", {
    page: currentPage.value,
    pageSize: pageSize,
  } as Pagination);
};

const handleCloseNotification = (index: number) => {
  store.dispatch("userExperience/removeNotification", index);
};

const onGameModalSubmit = (game: Game) => {
  store.dispatch("games/submitNewGame", game).finally(() => {
    showModal.value = false;
  });
};

onMounted(() => {
  store.dispatch("games/loadGames", {
    page: currentPage.value,
    pageSize: 25,
  } as Pagination);
});
</script>
<template>
  <Navbar />
  <NotificationsFeed
    :data="store.state.userExperience.notifications"
    @onClose="handleCloseNotification"
  />
  <GameModal
    v-if="showModal"
    @onSubmit="onGameModalSubmit"
    @onClose="showModal = false"
  />
  <Section name="Games">
    <template #actions v-if="!!store.state.games.list.length">
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="showModal = true"
      >
        Submit a game
      </button>
      <button type="button" class="btn btn-primary" @click="populateGames">
        Populate
      </button>
    </template>
    <template #content>
      <GamesList
        :games="
          store.state.games.search.length
            ? store.state.games.search
            : store.state.games.list
        "
        @onEmptyStateClick="showModal = true"
      />
    </template>
  </Section>
  <Section name="" v-if="store.state.games.list.length">
    <template #content>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-primary"
          @click="paginate({ pageSize: 25 })"
        >
          Load more games
        </button>
      </div>
    </template>
  </Section>
</template>
<style scoped></style>
