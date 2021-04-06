function handleServerResponse() {
  if (http.readyState === XMLHttpRequest.DONE) {
    const gameState = JSON.parse(http.responseText);
    const grid = document.getElementById("gameGrid");
    
    for(const child of grid.children) {
      const row = parseInt(child.getAttribute("row"));
      const col = parseInt(child.getAttribute("col"));

      child.innerText = gameState[row][col];
    }
  }
}

window.onload = function(){
    const rows = 10;
    const cols = 10;
    const grid = document.getElementById("gameGrid");

    for(let i=0; i<rows; i++) {
      for(let j=0; j<cols; j++) {
        const newDiv = createMinesweeperTile(i, j);
        console.log(newDiv);
        grid.appendChild(newDiv);
      }
    }
};


const http = new XMLHttpRequest();
http.onreadystatechange = handleServerResponse;
http.open('GET', 'board', true);
http.send();

function openTile(row, col) {
  http.open('POST', 'open', true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  http.send("row="+row+"&col="+col);
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
