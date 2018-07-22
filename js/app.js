function getData(url, callbackFunc) {
  let xhttp = new XMLHttpRequest();
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
  // Feladatok //
  deleteObject(userDatas, 'consumables', null);
  setValues(userDatas, null, 'unknown' );
  advBubbleSort(userDatas, 'cost_in_credits');
  showSpaceShipList(userDatas);
  showStats(userDatas);
}

getData('/json/spaceships.json', successAjax);

// Saját munka //
document.querySelector('title').innerHTML = 'STAR WARS spaceships';
document.querySelector('#search-text').placeholder = 'Search by model name';
document.querySelector('html').lang = 'en';

function deleteObject(arrayToClean, keyToSearchIn, valueToSearch) {
  for (let i = 0; i < arrayToClean.length; i++) {
    if (arrayToClean[i][`${keyToSearchIn}`] === valueToSearch) {
      arrayToClean.splice(i, 1);
      i -= 1;
    }
  }
}

function setValues(arrayToSet, oldValue, newValue) {
  for (let i = 0; i < arrayToSet.length; i++) {
    for (let j in arrayToSet[i]) {
      if (arrayToSet[i][j] === oldValue) {
        arrayToSet[i][j] = newValue;
      }
    }
  }
}

function advBubbleSort(arrayToSort, key) {
  setTypeToNumber(arrayToSort, key);
  let i = arrayToSort.length - 1; let j = 0;
  while (i >= 2) {
    let swap = 0;
    for (j = 0; j < i; j++) {
      if ( (arrayToSort[j][`${key}`] > arrayToSort[j + 1][`${key}`]) ||
            arrayToSort[j][`${key}`] === 'unknown' ) {
        [arrayToSort[j], arrayToSort[j + 1]] = [arrayToSort[j + 1], arrayToSort[j]];
        swap = j;
      }
    }
    i = swap;
  }
}

function setTypeToNumber(arrayToSet, key) {
  for (let i = 0; i < arrayToSet.length; i++) {
    if (arrayToSet[i][`${key}`] !== 'unknown') {
      arrayToSet[i][`${key}`] = Number(arrayToSet[i][`${key}`]);
    }
  }
}

function showSpaceShipList(userDatas) {
  let spaceshipList = document.querySelector('.spaceship-list');
  let listDiv = createListDiv(spaceshipList);
  for (let i = 0; i < userDatas.length; i++) {
    createSpaceship(listDiv, userDatas[i]);
  }
}

function createListDiv(spaceshipList) {
  let listDiv = spaceshipList.querySelector('.list-div');
  if (!listDiv) {
    listDiv = document.createElement('div');
    listDiv.className = 'list-div';
    spaceshipList.appendChild(listDiv);
  }
  return listDiv;
}

function createSpaceship(listDiv, spaceshipData) {
  let spaceshipItem = document.createElement('div');
  spaceshipItem.className = 'spaceship-item';
  // Az aktualis urhajo-item HTML Element objektumot kiegeszitjuk a benne tarolt urhajo-objektum adataival //
  spaceshipItem.spaceship = spaceshipData;
  let img = createImg(spaceshipData);
  spaceshipItem.appendChild(img);
  let spaceshipDatas = showData(spaceshipData);
  spaceshipDatas.className = 'data-div';
  spaceshipItem.appendChild(spaceshipDatas);
  listDiv.appendChild(spaceshipItem);
}

function createImg(spaceshipData) {
  let img = document.createElement('img');
  img.src = `/img/${spaceshipData.image}`;
  img.alt = spaceshipData.model;
  img.onerror = function showImageOnError(ev) {ev.target.src = '/img/957888-200.png';};
  return img;
}

function showData(spaceshipData) {
  let dataDiv = document.createElement('div');
  for (let key in spaceshipData) {
    if (Object.prototype.hasOwnProperty.call(spaceshipData, key)) {
      let pElement = document.createElement('p');
      pElement.innerHTML = `${capitalize(key.replace(/_/g, ' '))}: ${spaceshipData[key]}`;
      dataDiv.appendChild(pElement);
    }
  }
  return dataDiv;
}

function capitalize(stringToCapitalized) {
  return stringToCapitalized[0].toUpperCase() + stringToCapitalized.slice(1);
}

document.querySelector('#search-button').onclick = searchShip;

function searchShip() {
  let inputValue = document.querySelector('#search-text').value;
  let spaceshipItemList = document.querySelectorAll('.spaceship-list .spaceship-item');
  if (inputValue !== '') {
    for (let i = 0; i < spaceshipItemList.length; i++) {
      // A DOM-mal kivalszott HTML Element objektumokban elozoleg letarolt urhajo objektumokbol olvassuk ki az adatokat //
      if (spaceshipItemList[i].spaceship.model.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
        createOneSpaceship(spaceshipItemList[i].spaceship);
        break;
      }
    }
  }
}

function createOneSpaceship(spaceshipData) {
  let container = document.querySelector('.one-spaceship');
  let listDiv = createListDiv(container);
  listDiv.innerHTML = '';

  let img = createImg(spaceshipData);
  listDiv.appendChild(img);

  let spaceshipDatas = showData(spaceshipData);
  spaceshipDatas.className = 'search-data';

  listDiv.appendChild(spaceshipDatas);
}

function showStats(userDatas) {
  let statsDiv = document.createElement('div');
  statsDiv.className = 'stats-div';
  let spaceshipList = document.querySelector('.spaceship-list');
  spaceshipList.appendChild(statsDiv);
  let stats = [];
  stats[0] = 'Single crew ships: ' + countData(userDatas, 'crew', '1');
  stats[1] = 'Maximum cargo capacity: ' + findMax(userDatas, 'cargo_capacity').model;
  stats[2] = 'All transportable passengers: ' + sumData(userDatas, 'passengers');
  stats[3] = 'Image of the longest vehicle:';
  stats[4] = `<img src="/img/${findMax(userDatas, 'lengthiness').image}" alt="Image">`;
  createStats(stats, statsDiv);
}

function countData(data, key, value) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][`${key}`] === value) {
      result++;
    }
  }
  return result;
}

function findMax(data, key) {
  let maxValue = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][`${key}`] !== 'unknown') {
      if (Number(data[i][`${key}`]) > Number(maxValue[`${key}`])) {
        maxValue = data[i];
      }
    }
  }
  return maxValue;
}

function sumData(data, key) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][`${key}`] !== 'unknown') {
      sum += parseInt(data[i][`${key}`], 10);
    }
  }
  return sum;
}

function createStats(stats, statsDiv) {
  for (let i = 0; i < stats.length; i++) {
    let statSpan = document.createElement('span');
    statSpan.innerHTML = stats[i];
    statsDiv.appendChild(statSpan);
  }
}
