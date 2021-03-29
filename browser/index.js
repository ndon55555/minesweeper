function handleServerResponse() {
  if (http.readyState === XMLHttpRequest.DONE) {
    // const p = document.getElementById("changeThis");
    const gameState = JSON.parse(http.responseText);
    const grid = document.getElementById("gameGrid")
    //grid.innerHTML = ''; // Remove children

    // console.log(resp)
    // p.innerText = resp
  }
}

window.onload = function(){
    const rows = 10;
    const cols = 10;
    const grid = document.getElementById("gameGrid")
    let divID = 0;
    for(let i=0; i<rows; i++) {
      for(let j=0; j<cols; j++) {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "cell");
        newDiv.setAttribute("id", divID.toString())
        console.log(newDiv);
        divID++;
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
