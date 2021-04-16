const GAME_GRID_ID = "gameGrid"
const gameGridElement = document.getElementById(GAME_GRID_ID)

if (gameGridElement == null) {
    throw `HTML Div element with id '${GAME_GRID_ID}' must exist`
}
const GAME_GRID_DIV = <HTMLDivElement>gameGridElement

type Position = [number, number]

export type Board = Iterable<[Position, Tile]>

export interface BoardFactory {
    (rows: number, cols: number): Board
}

export interface Tile {
    value: string
    setOnClick(handler: () => void): void
}

class DivGameTile implements Tile {
    private readonly div: HTMLDivElement

    constructor() {
        this.div = <HTMLDivElement>document.createElement("div")
        this.div.setAttribute("class", "cell")
        this.div.innerText = ""
        GAME_GRID_DIV.appendChild(this.div)
    }

    setOnClick(handler: () => void): void {
        this.div.onclick = handler
    }

    set value(v: string) {
        this.div.innerText = v
    }

    get value(): string {
        return this.div.innerText
    }
}

class DivBoard implements Board {
    private tiles: Array<Array<Tile>> = []

    constructor(rows: number, cols: number) {
        this.clearGameGrid()
        this.resizeGameGridDimensions(rows, cols)
        this.generateTiles(rows, cols)
    }

    private clearGameGrid(): void {
        while (GAME_GRID_DIV.firstChild) {
            GAME_GRID_DIV.removeChild(GAME_GRID_DIV.firstChild)
        }
    }

    private resizeGameGridDimensions(rows: number, cols: number): void {
        GAME_GRID_DIV.style.setProperty("--grid-rows", rows.toString())
        GAME_GRID_DIV.style.setProperty("--grid-cols", cols.toString())
    }

    private generateTiles(rows: number, cols: number): void {
        for (let i = 0; i < rows; i++) {
            const row: Array<Tile> = []
            this.tiles.push(row)

            for (let j = 0; j < cols; j++) {
                row.push(new DivGameTile())
            }
        }
    }

    *[Symbol.iterator](): Iterator<[Position, Tile]> {
        const rowIndices = this.tiles.keys()
        for (const i of rowIndices) {
            const colIndices = this.tiles[i].keys()
            for (const j of colIndices) {
                const pair: [Position, Tile] = [[i, j], this.tiles[i][j]]
                yield pair
            }
        }
    }
}

export function createBoard(rows: number, cols: number): Board {
    return new DivBoard(rows, cols)
}