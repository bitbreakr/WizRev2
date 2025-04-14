import { type StoreOptions } from "vuex";

export interface Notification {
  title: string;
  content: string;
}

export interface UserExperienceState {
  notifications: Notification[];
}

export const userExperienceStore: StoreOptions<UserExperienceState> = {
  state: {
    notifications: [],
  },
  getters: {},
  mutations: {
    pushNotification(state, notification: Notification) {
      state.notifications.push(notification);
    },
    popNotification(state, index: number) {
      state.notifications.splice(index, 1);
    },
  },
  actions: {
    async spanNotification({ commit }, notification: Notification) {
      commit("pushNotification", notification);
    },
    async removeNotification({ commit }, index: number) {
      commit("popNotification", index);
    },
  },
};
