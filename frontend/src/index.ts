import { io, Socket } from "socket.io-client"


function getSocket(): Socket {
    const socket = io()

    const setupTiles = (jsonGameState: string): void => {
        const openTile = (row: number, col: number): void => {
            socket.emit("open", row, col)
        }

        const createMinesweeperTile = (i: number, j: number, value: string): HTMLDivElement => {
            const newDiv = <HTMLDivElement>document.createElement("div")
            newDiv.setAttribute("class", "cell")
            newDiv.setAttribute("row", i.toString())
            newDiv.setAttribute("col", j.toString())
            newDiv.innerText = value
            newDiv.onclick = function() {
                openTile(i, j)
            }

            return newDiv
        }

        const gameState = <Array<string>>JSON.parse(jsonGameState)
        const rows = gameState.length
        const cols = gameState[0].length
        const grid = <HTMLDivElement>document.getElementById("gameGrid")

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const newDiv = createMinesweeperTile(row, col, gameState[row][col])
                grid?.appendChild(newDiv)
            }
        }

        const container = document.getElementById("gameContainer")
        container?.style.setProperty("--grid-rows", rows.toString())
        container?.style.setProperty("--grid-cols", cols.toString())
    }

    socket.on("board", setupTiles)

    const updateTiles = (jsonGameState: string): void => {
        const gameState = <Array<string>>JSON.parse(jsonGameState)
        const grid = <HTMLDivElement>document.getElementById("gameGrid")
        const children = grid.children

        for (let i = 0; i < children.length; i++) {
            const child = <HTMLDivElement>children.item(i)
            const row = parseInt(child.getAttribute("row") ?? "")
            const col = parseInt(child.getAttribute("col") ?? "")

            child.innerText = gameState[row][col]
        }
    }

    socket.on("open", updateTiles)

    return socket
}

function main(): void {
    const socket = getSocket()
    socket.emit("board") // Request the current state of the game to render on the page
}

window.onload = main