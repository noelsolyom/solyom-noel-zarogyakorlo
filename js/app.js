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
  deleteObject(userDatas);
  setValues(userDatas);
  setType(userDatas);
  advBubbleSort(userDatas);
  showSpaceShipList(userDatas);
  showStats(userDatas);
}

getData('/json/spaceships.json', successAjax);

document.querySelector('title').innerHTML = 'STAR WARS spaceships';

function deleteObject(arrayToClean) {
  for (let i = 0; i < arrayToClean.length; i++) {
    if (arrayToClean[i].consumables === null) {
      arrayToClean.splice(i, 1);
      i -= 1;
    }
  }
}

function setValues(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j in array[i]) {
      if (array[i][j] === null) {
        array[i][j] = 'unknown';
      }
    }
  }
}

function setType(arrayToSet) {
  for (let i = 0; i < arrayToSet.length; i++) {
    if (arrayToSet[i].cost_in_credits !== 'unknown') {
      arrayToSet[i].cost_in_credits = Number(arrayToSet[i].cost_in_credits);
    }
  }
}

function advBubbleSort(arrayToSort) {
  let i = arrayToSort.length - 1; let j = 0;
  while (i >= 2) {
    let swap = 0;
    for (j = 0; j < i; j++) {
      if ( (arrayToSort[j].cost_in_credits > arrayToSort[j + 1].cost_in_credits) ||
            arrayToSort[j].cost_in_credits === 'unknown' ) {
        [arrayToSort[j], arrayToSort[j + 1]] = [arrayToSort[j + 1], arrayToSort[j]];
        swap = j;
      }
    }
    i = swap;
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

function capitalize(stringToCapitalized) {
  return stringToCapitalized[0].toUpperCase() + stringToCapitalized.slice(1);
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

document.querySelector('#search-button').onclick = searchShip;

function searchShip() {
  let inputValue = document.querySelector('#search-text').value;
  let spaceshipItemList = document.querySelectorAll('.spaceship-list .spaceship-item');
  if (inputValue !== '') {
    for (let i = 0; i < spaceshipItemList.length; i++) {
      if (spaceshipItemList[i].spaceship.model.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
        createOneSpaceShip(spaceshipItemList[i].spaceship);
        break;
      }
    }
  }
}

function createOneSpaceShip(spaceshipData) {
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
  stats[0] = 'Single crew ships: ' + countCrew(userDatas);
  stats[1] = 'Maximum cargo capacity: ' + findMaxCargo(userDatas);
  stats[2] = 'All transportable passengers: ' + countSumPassengers(userDatas);
  stats[3] = 'Image of the longest vehicle:';
  stats[4] = `<img src="/img/${findMaxlengthiness(userDatas)}" alt="Image">`;
  createStats(stats, statsDiv);
}

function countCrew(userDatas) {
  let singleCrew = 0;
  for (let i = 0; i < userDatas.length; i++) {
    if (userDatas[i].crew === '1') {
      singleCrew++;
    }
  }
  return singleCrew;
}

function findMaxCargo(userDatas) {
  let maxCargo = userDatas[0];
  for (let i = 1; i < userDatas.length; i++) {
    if (userDatas[i].cargo_capacity !== 'unknown') {
      if (Number(userDatas[i].cargo_capacity) > Number(maxCargo.cargo_capacity)) {
        maxCargo = userDatas[i];
      }
    }
  }
  return maxCargo.model;
}

function countSumPassengers(userDatas) {
  let sumPassengers = 0;
  for (let i = 0; i < userDatas.length; i++) {
    if (userDatas[i].passengers !== 'unknown') {
      sumPassengers += parseInt(userDatas[i].passengers, 10);
    }
  }
  return sumPassengers;
}

function findMaxlengthiness(userDatas) {
  let maxLengthiness = userDatas[0];
  for (let i = 1; i < userDatas.length; i++) {
    if (parseInt(userDatas[i].lengthiness, 10) > parseInt(maxLengthiness.lengthiness, 10)) {
      maxLengthiness = userDatas[i];
    }
  }
  return maxLengthiness.image;
}

function createStats(stats, statsDiv) {
  for (let i = 0; i < stats.length; i++) {
    let spanStat = document.createElement('span');
    spanStat.innerHTML = stats[i];
    statsDiv.appendChild(spanStat);
  }
}
