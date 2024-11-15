import { GridCell } from "..";
import { TileCollection } from "./TileCollection";


export const tiles = (list: GridCell[]) => new TileCollection(list);
