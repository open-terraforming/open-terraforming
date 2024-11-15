import { drawCard } from './drawCard';
import { GameState } from "..";
import { range } from "./range";


export const drawCards = (game: GameState, count: number) => range(0, count).map(() => drawCard(game));
