import { io, Socket } from "socket.io-client"
import { Board, createBoard } from "./Game"

function parseGameJSON(jsonGameState: string): Array<Array<string>> {
    return <Array<Array<string>>>JSON.parse(jsonGameState)
}

function setupSocket(socket: Socket): void {
    let board: Board

    function openTile(row: number, col: number): void {
        socket.emit("open", row, col)
    }

    socket.onAny((eventName: string, ...args: string[]) => {
        switch (eventName) {
            case "board": {
                const gameState = parseGameJSON(args[0])
                const rows = gameState.length
                const cols = gameState[0].length
                board = createBoard(rows, cols)

                for (const [[row, col], tile] of board) {
                    tile.value = gameState[row][col]
                    tile.setOnClick(() => openTile(row, col))
                }

                break
            }

            case "open": {
                const gameState = parseGameJSON(args[0])

                for (const [[row, col], tile] of board) {
                    tile.value = gameState[row][col]
                }
                break
            }

            default: {
                throw `Unknown event ${eventName}`
            }
        }
    })
}

function main(): void {
    const socket = io()
    setupSocket(socket)
    socket.emit("board") // Request the current state of the game to render on the page
}

window.onload = main