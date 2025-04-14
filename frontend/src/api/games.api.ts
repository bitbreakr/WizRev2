import httpInstance from "./http.instance.ts";
import type { Game, PaginatedResponse, Pagination } from "./types";

export const populateGames = async () => {
  await httpInstance.put("/games/populate");
};

export const fetchGames = async (
  pagination?: Pagination,
): Promise<PaginatedResponse<Game>> => {
  const request = await httpInstance.get<PaginatedResponse<Game>>("/games", {
    params: pagination,
  });

  return request.data;
};

export const createGame = async (game: Omit<Game, "id">): Promise<Game> => {
  const request = await httpInstance.post<Game>("/games", game);

  return request.data;
};

export const deleteGame = async (gameId: string): Promise<void> => {
  await httpInstance.delete(`/games/${gameId}`);
};

export const updateGame = async (
  gameId: string,
  game: Omit<Game, "id">,
): Promise<Game> => {
  const request = await httpInstance.patch<Game>(`/games/${gameId}`, game);

  return request.data;
};
