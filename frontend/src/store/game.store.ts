import { type StoreOptions } from "vuex";
import {
  createGame,
  deleteGame,
  fetchGames,
  type Game,
  type Pagination,
  updateGame,
} from "../api";
import { MeiliSearch } from "meilisearch";
import { isAxiosError } from "axios";
import type { Notification } from "./user-experience.store.ts";

export interface GameState {
  list: Game[];
  search: Game[];
}

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "wizGj762Kja98UxzPqLm53sBn45DfR",
});

export const gameStore: StoreOptions<GameState> = {
  state: {
    list: [],
    search: [],
  },
  mutations: {
    replaceGame(state, game: Game) {
      const index = state.list.findIndex((cursor) => cursor.id === game.id);
      if (Number.isFinite(index)) {
        state.list.splice(
          state.list.findIndex((cursor) => cursor.id === game.id)!,
          1,
          game,
        );
      }
    },
    popGame(state, gameId: string) {
      state.list = state.list.filter((game: Game) => game.id !== gameId);
    },
    pushGame(state, game: Game) {
      state.list.push(game);
    },
    setGames(state, games: Game[]) {
      state.list = games;
    },
    setSearchResults(state, searchValues: Game[]) {
      state.search = searchValues;
    },
  },
  actions: {
    async updateGame({ commit, dispatch }, dataToUpdate: Game) {
      try {
        const { id, ...game } = dataToUpdate;
        const updatedGame = await updateGame(id, game);
        commit("replaceGame", updatedGame);
      } catch (error) {
        if (isAxiosError(error)) {
          dispatch(
            "userExperience/spanNotification",
            <Notification>{
              title: "Update error",
              content: error.response!.data.message,
            },
            { root: true },
          );
        }
      }
    },
    async loadGames({ commit, state }, pagination?: Pagination) {
      try {
        const paginatedResponse = await fetchGames(pagination);
        commit("setGames", [...state.list, ...paginatedResponse.data]);
      } catch {
        //
      }
    },
    async submitNewGame({ commit, dispatch }, game: Omit<Game, "id">) {
      try {
        const createdGame = await createGame(game);
        commit("pushGame", createdGame);
      } catch (error) {
        if (isAxiosError(error)) {
          dispatch(
            "userExperience/spanNotification",
            <Notification>{
              title: "Submission error",
              content: error.response!.data.message,
            },
            { root: true },
          );
        }
      }
    },
    async deleteGame({ commit }, game: Game) {
      await deleteGame(game.id);
      commit("popGame", game.id);
    },
    searchGames({ commit }, payload) {
      // Check if payload is an object (with platform filter) or just a string (keyword only)
      let searchQuery = "";
      let filter = [];

      if (typeof payload === "string") {
        // Legacy case: just a keyword search
        searchQuery = payload;
      } else {
        // New case: object with keyword and platform
        searchQuery = payload.keyword || "";

        // Add platform filter if specified
        if (payload.platform !== "all") {
          filter.push(`platform = ${payload.platform}`);
        }
      }

      // Perform the search with the appropriate filters
      client
        .index("games")
        .search(searchQuery, {
          filter: filter.length > 0 ? filter : undefined,
        })
        .then((result) => {
          commit("setSearchResults", result.hits);
        });
    },
  },
};

// import { type StoreOptions } from "vuex";
// import {
//   createGame,
//   deleteGame,
//   fetchGames,
//   type Game,
//   type Pagination,
//   updateGame,
// } from "../api";
// import { MeiliSearch } from "meilisearch";
// import { isAxiosError } from "axios";
// import type { Notification } from "./user-experience.store.ts";
//
// export interface GameState {
//   list: Game[];
// }
//
// const client = new MeiliSearch({
//   host: "http://127.0.0.1:7700",
//   apiKey: "wizGj762Kja98UxzPqLm53sBn45DfR",
// });
//
// export const gameStore: StoreOptions<GameState> = {
//   state: {
//     list: [],
//   },
//   mutations: {
//     replaceGame(state, game: Game) {
//       const index = state.list.findIndex((cursor) => cursor.id === game.id);
//       if (Number.isFinite(index)) {
//         state.list.splice(
//           state.list.findIndex((cursor) => cursor.id === game.id)!,
//           1,
//           game,
//         );
//       }
//     },
//     popGame(state, gameId: string) {
//       state.list = state.list.filter((game: Game) => game.id !== gameId);
//     },
//     pushGame(state, game: Game) {
//       state.list.push(game);
//     },
//     setGames(state, games: Game[]) {
//       state.list = games;
//     },
//   },
//   actions: {
//     async updateGame({ commit, dispatch }, dataToUpdate: Game) {
//       try {
//         const { id, ...game } = dataToUpdate;
//         const updatedGame = await updateGame(id, game);
//         commit("replaceGame", updatedGame);
//       } catch (error) {
//         if (isAxiosError(error)) {
//           dispatch(
//             "userExperience/spanNotification",
//             <Notification>{
//               title: "Update error",
//               content: error.response!.data.message,
//             },
//             { root: true },
//           );
//         }
//       }
//     },
//     async loadGames({ commit, state }, pagination?: Pagination) {
//       try {
//         const paginatedResponse = await fetchGames(pagination);
//         commit("setGames", [...state.list, ...paginatedResponse.data]);
//       } catch {
//         //
//       }
//     },
//     async submitNewGame({ commit, dispatch }, game: Omit<Game, "id">) {
//       try {
//         const createdGame = await createGame(game);
//         commit("pushGame", createdGame);
//       } catch (error){
//           if (isAxiosError(error)) {
//             dispatch(
//               "userExperience/spanNotification",
//               <Notification>{
//                 title: "Submission error",
//                 content: error.response!.data.message,
//               },
//               { root: true },
//             );
//           }
//         }
//     },
//     async deleteGame({ commit }, game: Game) {
//       await deleteGame(game.id);
//       commit("popGame", game.id);
//     },
//     searchGames({ commit }, query: string) {
//       client
//         .index("games")
//         .search(query)
//         .then((result) => {
//           commit("setGames", result.hits);
//         });
//     },
//   },
// };
