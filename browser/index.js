function handleServerResponse() {
  if (http.readyState === XMLHttpRequest.DONE) {
    const p = document.getElementById("changeThis");
    p.innerText = http.responseText;
  }
}

const http = new XMLHttpRequest();
http.onreadystatechange = handleServerResponse;
http.open('GET', 'board', true);
http.send();

function openTile(row, col) {
  http.open('POST', 'open', true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  http.send("row="+row+"&col="+col);
}
