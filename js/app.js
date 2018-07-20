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
  var userDatas = JSON.parse(xhttp.responseText)[2].data;
  deleteElementFromArrayOfObjects(userDatas, 'consumables', null);
  overwriteEveryValuesOfObjectsInArray(userDatas, null, 'unknown');
  advBubbleSortForArrayOfObjects(userDatas, 'cost_in_credits');
  createSpaceShipList(userDatas);
}

getData('/json/spaceships.json', successAjax);

document.querySelector('#search-button').onclick = searchShip;

// Paraméter: objektumokkal feltöltött tömb, kulcs amiben keres, érték ami alapján keres //
function deleteElementFromArrayOfObjects(inputArrayofObjects, key, value) {
  for (let i = 0; i < inputArrayofObjects.length; i++) {
    if (inputArrayofObjects[i][key] === value) {
      inputArrayofObjects.splice(i, 1);
      i -= 1;
    }
  }
}

// Paraméter: objektumokkal feltöltött tömb, régi érték amit felülír, új érték amire módosít //
function overwriteEveryValuesOfObjectsInArray(inputarray, oldValue, newValue) {
  for (let i = 0; i < inputarray.length; i++) {
    for (let key in inputarray[i]) {
      if (inputarray[i][key] === oldValue) {inputarray[i][key] = newValue;}
    }
  }
}

// Paraméter: objektumokkal feltöltött tömb, tulajdonság, ami alapján rendez //
function advBubbleSortForArrayOfObjects(inputArray, propertyName) {
  let i = inputArray.length - 1; let j = 0;
  while (i >= 2) {
    let swap = 0;
    for (j = 0; j < i; j++) {
      setTypeOfObjectProperty(inputArray[j], propertyName);
      setTypeOfObjectProperty(inputArray[j + 1], propertyName);
      if ((inputArray[j][`${propertyName}`] > inputArray[j + 1][`${propertyName}`]) ||
          (typeof inputArray[j][`${propertyName}`] !== 'number'))  {
        [inputArray[j], inputArray[j + 1]] = [inputArray[j + 1], inputArray[j]]; swap = j;
      }
    } i = swap;
  }
}

// Paraméter: objektum, módosítandó kulcs //
function setTypeOfObjectProperty(inputObject, propertyName) {
  if (typeof inputObject[`${propertyName}`] !== 'number' && inputObject[`${propertyName}`] !== 'unknown') {
    inputObject[`${propertyName}`] = Number(inputObject[`${propertyName}`]);
  }
}

// Praméter: objektumokkal feltöltött tömb, amit listáz //
function createSpaceShipList(listSource) {
  let spaceshipList = document.querySelector('.spaceship-list');
  let listDiv = createListDiv(spaceshipList);
  for (let i = 0; i < listSource.length; i++) {
    createSpaceshipIntoList(listDiv, listSource[i]);
  }
}

// Paraméter: az új Div elemet tartalmazó konténer Div element //
function createListDiv(containerDiv) {
  let listDiv = containerDiv.querySelector('.list-div');
  if (!listDiv) {
    listDiv = document.createElement('div');
    listDiv.className = 'list-div';
    containerDiv.appendChild(listDiv);
  }
  return listDiv;
}

// Paraméter: kép nevét .image kulcsban tartalmazó objektum //
// Visszatérési érték: IMG element //
function createImg(spaceShip) {
  let img = document.createElement('img');
  img.src = `/img/${spaceShip.image}`;
  img.alt = '';
  img.onerror = function showImageOnError(ev) {ev.target.src = '/img/957888-200.png';};
  return img;
}

// Paraméter: ahova a listát szeretnénk készíteni Div element, űrhajó adatait tartalmazó objektum //
function createSpaceshipIntoList(listDiv, spaceShip) {
  let listItemDiv = document.createElement('div');
  listItemDiv.className = 'spaceship-item';

  listItemDiv.appendChild(createImg(spaceShip));

  let textDatas = document.createElement('div');
  textDatas.className = 'text-data';
  listItemDiv.appendChild(textDatas);
  // Aktuális DIV Element objektum bővítése a benne megjelenített hajó adataival
  listItemDiv.spaceship = spaceShip;
  for (let key in spaceShip) {
    if (Object.prototype.hasOwnProperty.call(spaceShip, key)) {
      let pElement = document.createElement('p');
      pElement.innerHTML = `${key.replace(/_/g, ' ')}: ${spaceShip[key]}`;
      textDatas.appendChild(pElement);
    }
  }
  listDiv.appendChild(listItemDiv);
}

function searchShip() {
  let inputValue = document.querySelector('#search-text').value;
  let dataList = document.querySelectorAll('.spaceship-list .spaceship-item');
  for (let i = 0; i < dataList.length; i++) {
    if (dataList[i].spaceship.model.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
      createOneSpaceShip(dataList[i].spaceship);
      break;
    }
  }
  inputValue.value = '';
}

// Paraméter: string, aminek az első betűjét kell nagybetűssé alakítani //
// Visszatérési érték: Első betűnél nagybetűssé alakított string //
function capitalizeFirstLetter(stringToCapitalize) {
  return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1);
}

// paraméter: űrhajó adatait tartlamazó objektum //
function createOneSpaceShip(spaceShip) {
  let container = document.querySelector('.one-spaceship');
  let resultDiv = createListDiv(container);
  resultDiv.innerHTML = '';

  resultDiv.appendChild(createImg(spaceShip));

  for (let key in spaceShip) {
    if (Object.prototype.hasOwnProperty.call(spaceShip, key)) {
      let spanElement = document.createElement('p');
      spanElement.innerHTML = `<u>${(capitalizeFirstLetter(key.replace(/_/g, ' ')))}</u>: ${spaceShip[key]}`;
      resultDiv.appendChild(spanElement);
    }
  }
}
