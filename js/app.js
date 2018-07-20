function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function ifItsReady() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  var userDatas = JSON.parse(xhttp.responseText);
  console.log(userDatas);
}

getData('/json/spaceships.json', successAjax);
