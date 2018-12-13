let ulFirst = document.querySelector('#first');
let ulSecond = document.querySelector('#second');
let navBreed = document.querySelector('.breed');
let subBreed = document.querySelector('.subBreed');
let main = document.querySelector('main');
let h2 = document.querySelector('h2');
let pictures = document.querySelector('.pictures');
let hash = window.location.hash;


api('breeds/list/all', function(data) {
  for (let key in data) {
    let li = document.createElement('li');
    let aLink = document.createElement('a');
    aLink.onclick = function() {
      viewBreedPage(key);
    };
    aLink.innerHTML = key;
    ulFirst.appendChild(li);
    li.appendChild(aLink);
  }
});

pageLoad();


function api(path, callback) {
  request('https://dog.ceo/api/' + path, callback);
}

function request(path, callback) {
  let request = new XMLHttpRequest;
  request.addEventListener('load', function() {
    let parsed = JSON.parse(this.responseText);
    callback(parsed.message);
  });
  request.open('GET', path);
  request.send();
}

function pageLoad() {
  if (hash.length === 0) {
    render('breeds/image/random');
  } else if (hash.length > 0) {
    let hashValue = hash.replace('#', '');
    let breedSplit = hashValue.split('-');
    if (breedSplit.length === 1 && breedSplit[0].length > 0) {
      viewBreedPage(breedSplit[0]);
    }
    else if (breedSplit.length > 1 && breedSplit[1].length > 0) {
      viewSubBreed(breedSplit[0], breedSplit[1]);
      renderSubBreeds(breedSplit[0]);
    }
  }
}

function render(url) {
  api(url, function(data) {
    main.innerHTML = `
      <div class="singlePic">
          <img src='${data}'>
          <br>
          <button id="nextDog">Shuffle</button>
      </div>
    `;
    let button = document.querySelector('#nextDog');
    button.addEventListener('click', function(event) {
      api(url, function(data) {
        let img = document.querySelector('img');
        img.src = data;
      });
    });
  });
}

function viewBreedPage(breed) {
  setHash(breed);
  setHeaderTitle(breed.toUpperCase());
  breedPageStructure();
  renderRandomImage('breed/' + breed + '/images/random');
  renderAllImages('breed/' + breed + '/images');
  renderSubBreeds(breed);
}

function viewSubBreed(breed, subBreed) {
  setHash(breed + '-' + subBreed);
  setHeaderTitle(breed.toUpperCase() + '-' + subBreed.toUpperCase());
  breedPageStructure();
  renderRandomImage('breed/' + breed + '/' + subBreed + '/images/random');
  renderAllImages('breed/' + breed + '/' + subBreed + '/images');
}

function setHash(hash) {
  window.location.hash = hash;
}

function setHeaderTitle(title) {
  h2.innerHTML = title;
}

function breedPageStructure() {
  main.innerHTML = `
    <div class="breedImages">

    </div>
    <div class="singlePic">

    <br>
    <button id="nextDog">Shuffle</button>
    </div>
  `;
}

function renderSubBreeds(breed) {
  api('breed/' + breed + '/list', function(data) {
    let h3 = document.querySelector('.subBreed h3');
    h3.innerHTML = 'SUB-BREEDS';
    ulSecond.innerHTML = '';
    if (data.length > 0) {
      for (let item of data) {
        let li = document.createElement('li');
        let linkA = document.createElement('a');
        linkA.onclick = function() {
          viewSubBreed(breed, item);
        };
        linkA.innerHTML = item;
        ulSecond.appendChild(li);
        li.appendChild(linkA);
        subBreed.style.width = '500px';
        navBreed.style.width = '500px';
      }
    } else {
      subBreed.style.width = '0px';
      navBreed.style.width = '1000px';
    }
  });
}

function renderRandomImage(url) {
  api(url, function(data) {
    let randomImage = document.createElement('img');
    randomImage.src = data;
    let singlePic = document.querySelector('.singlePic');
    let brTag = document.querySelector('br');
    singlePic.insertBefore(randomImage, brTag);

    let button = document.querySelector('#nextDog');
    button.addEventListener('click', function(event) {
      api(url, function(data) {
        randomImage.src = data;
      });
    });
  });
}

function renderAllImages(url) {
  api(url, function(data) {
    let breedImages = document.querySelector('.breedImages');
    for (let item of data) {
      let img = document.createElement('img');
      img.setAttribute('id', 'gallery')
      img.src = item;
      breedImages.appendChild(img);
    }
  });
}
