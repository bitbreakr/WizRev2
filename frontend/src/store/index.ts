import { createStore } from "vuex";
import { gameStore } from "./game.store.ts";
import { userExperienceStore } from "./user-experience.store.ts";

export const store = createStore({
  modules: {
    games: {
      ...gameStore,
      namespaced: true,
    } as any,
    userExperience: {
      ...userExperienceStore,
      namespaced: true,
    } as any,
  },
});
