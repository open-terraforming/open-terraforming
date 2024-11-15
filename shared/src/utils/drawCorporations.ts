import { drawCorporation } from './drawCorporation';
import { GameState } from "..";
import { range } from "./range";


export const drawCorporations = (game: GameState, count: number) => range(0, count).map(() => drawCorporation(game));
