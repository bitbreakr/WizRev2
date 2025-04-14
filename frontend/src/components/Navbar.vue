<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import type { GameState } from "../store/game.store.ts";

const store = useStore<GameState>();
const userWantsToSearch = ref<boolean>(false);
const searchInputValue = ref<string>("");
const selectedPlatform = ref<string>("all");

const onSearchInputFocusedIn = () => {
  userWantsToSearch.value = true;
};

const onSearchInputFocusedOut = () => {
  userWantsToSearch.value = false;
};

const search = ($event?: KeyboardEvent) => {
  if (searchInputValue.value === "") {
    // If no search term but platform is selected
    if (selectedPlatform.value !== "all") {
      store.dispatch("games/searchGames", {
        keyword: "",
        platform: selectedPlatform.value,
      });
    } else {
      // No search term and "all" platform selected
      store.dispatch("games/loadGames");
    }
  } else {
    // Has search term and possibly platform filter
    if (selectedPlatform.value !== "all") {
      store.dispatch("games/searchGames", {
        keyword: searchInputValue.value,
        platform: selectedPlatform.value,
      });
    } else {
      // Has search term but "all" platform selected
      store.dispatch("games/searchGames", searchInputValue.value);
    }
  }
};

const changePlatform = () => {
  search();
};
</script>
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Voodoo</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div
          class="search-container ms-auto"
          :class="{ expanded: userWantsToSearch }"
        >
          <form class="d-flex" role="search">
            <div class="platform-selector me-2">
              <select
                v-model="selectedPlatform"
                class="form-select"
                @change="changePlatform"
              >
                <option value="all">All Platforms</option>
                <option value="ios">iOS</option>
                <option value="android">Android</option>
              </select>
            </div>
            <input
              @keyup="search"
              @focusin="onSearchInputFocusedIn"
              @focusout="onSearchInputFocusedOut"
              v-model="searchInputValue"
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.search-container {
  position: relative;
  width: auto;
  max-width: 450px;
  margin-left: auto;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
}

.search-container.expanded {
  max-width: 100%;
  width: 100%;
}

form {
  width: 100%;
  display: flex;
}

.form-control {
  transition: all 0.3s ease-in-out;
  width: 100%;
}

.platform-selector {
  min-width: 120px;
}

@media (max-width: 992px) {
  .search-container {
    max-width: 100%;
    width: 100%;
  }

  .search-container.expanded {
    max-width: 100%;
    width: 100%;
  }

  form {
    flex-wrap: wrap;
  }

  .platform-selector {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>