import { GameState } from "..";


export const getPlayerIndex = (game: GameState, playerId: number) => game.players.findIndex((p) => p.id === playerId);
