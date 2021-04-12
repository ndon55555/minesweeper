window.onload = function(){
    const rows = 10;
    const cols = 10;
    const grid = document.getElementById("gameGrid");

    for(let i=0; i<rows; i++) {
      for(let j=0; j<cols; j++) {
        const newDiv = createMinesweeperTile(i, j);
        grid.appendChild(newDiv);
      }
    }
};

const socket = io();
socket.emit("board");
socket.on("board", function(jsonGameState) {
    const gameState = JSON.parse(jsonGameState);
    const grid = document.getElementById("gameGrid");

    for(const child of grid.children) {
      const row = parseInt(child.getAttribute("row"));
      const col = parseInt(child.getAttribute("col"));

      child.innerText = gameState[row][col];
    }
});
socket.on("open", function(jsonGameState) {
  console.log("got an open response")
  const gameState = JSON.parse(jsonGameState);
  const grid = document.getElementById("gameGrid");

  for(const child of grid.children) {
    const row = parseInt(child.getAttribute("row"));
    const col = parseInt(child.getAttribute("col"));

    child.innerText = gameState[row][col];
  }
});

function openTile(row, col) {
  socket.emit("open", row, col);
}

function createMinesweeperTile(i, j) {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", "cell");
  newDiv.setAttribute("row", i);
  newDiv.setAttribute("col", j);
  newDiv.onclick = function() {
    openTile(i, j);
  }

  return newDiv
}
