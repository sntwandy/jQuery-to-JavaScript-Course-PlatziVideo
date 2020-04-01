console.log('Hello World!');
const notChange = 'Wandy';

let change = "@sntwandy"

function changeName(newName) {
  change = newName
}

// Promises

const getUsers = new Promise(function(resolve, reject){
  setTimeout(function(){
    resolve('Everything is OK')
    //reject('Not OK')
  }, 3000)
})

const getAllUsers = new Promise(function(resolve, reject){
  setTimeout(function(){
    resolve('Everything is OK')
    //reject('Not OK')
  }, 5000)
})

// Execute all promises (array) and returns a array with success ir not success.
Promise.all([getUsers, getAllUsers]).then(function(message){
  console.log(message)
}).catch(function(message){
  console.log(message)
})

// Execute the first promise that execute with suceess or not success.
/*Promise.race([getUsers, getAllUsers]).then(function(message){
  console.log(message)
}).catch(function(message){
  console.log(message)
})*/

// Petitions

// With jQuery
$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data){
    console.log(data)
  },
  error: function(error){
    console.log(error)
  }
})

// With JavaScript Vanilla
fetch('https://randomuser.me/api/').then(function(response){
  //console.log(response)
  return response.json()
}).then(function(user){
  console.log('User', user.results[0].name.first, user.results[0].name.last)
}).catch(function(){
  console.log('Something is wrong')
});


// Asyncronus functions with async await petitions to API
(async function load(){
  //await
  async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  const BASE_API = 'https://yts.mx/api/v2/';

  const actionList = await getData(`${BASE_API}list_movies.json?genre=action`);
  const dramaList = await getData(`${BASE_API}list_movies.json?genre=drama`);
  const animationList = await getData(`${BASE_API}list_movies.json?genre=animation`);

  const $animationContainer = document.getElementById('animation');
  const $actionContainer = document.getElementById('action');
  const $dramaContainer = document.getElementById('drama');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $featuringContainer = document.getElementById('featuring');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');

  function featuringTemplate(movieData){
    return(
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${movieData.medium_cover_image}"  width="70" />
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${movieData.title}</p>
        </div>
      </div>
      `
    )
  }

  function setAttributes($element, attributes){
    for (const key in attributes){
      $element.setAttribute(key, attributes[key]);
    }
  }

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');

    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      width: 50,
      height: 50 
    });
    $featuringContainer.append($loader);

// Making a Petition to API to search a movie
    const data = new FormData($form);
    // destructuring assignment
    const {
      data:{
        movies: movieData
      }
    } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
    const HTMLString = featuringTemplate(movieData[0]);
    $featuringContainer.innerHTML = HTMLString;
  });

  const $modalTitle = $modal.querySelector('h1');
  const $modalImg = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

    // Templates in JS.
function videoItemTemplate(item, category){
  return (
    `<div class="primaryPlaylistItem" data-id="${item.id}" data-category="${category}">
      <div class="primaryPlaylistItem-image">
        <img src="${item.medium_cover_image}" />
      </div>
        <h4 class="primaryPlaylistItem-title">${item.title}</h4>
    </div>`
  )
}

function createTemplate(HTMLString){
  const html = document.implementation.createHTMLDocument();
  html.body.innerHTML = HTMLString;
  return html.body.children[0];
}

function addEventClick($element){
  $element.addEventListener('click', () => showModal($element));
}

function renderMovieList(list, $container, category){
    $container.children[0].remove();
    list.forEach((item) =>{
    const HTMLString = videoItemTemplate(item, category);
    const movieElement = createTemplate(HTMLString); 
    $container.append(movieElement);
    addEventClick(movieElement);
    //console.log(HTMLString)
  })
}

function showModal($element){
  $overlay.classList.add('active');
  $modal.style.animation = 'modalIn .8s forwards';
  const id = $element.dataset.id;
  const category = $element.dataset.category;
}

$hideModal.addEventListener('click', () => {
  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .8s forwards';
})

const kindList = (kList) => kList = kList.data.movies;

renderMovieList(kindList(actionList), $actionContainer, 'action');
renderMovieList(kindList(dramaList), $dramaContainer, 'drama');
renderMovieList(kindList(animationList), $animationContainer, 'animation');


  // console.log(videoItemTemplate('src/images/covers/bitcoin.jpg', 'Bitcoin'));
  /*
  console.log('Action List:' ,actionList);
  console.log('Drama List:', dramaList);
  console.log('Animation List:', animationList);*/
})()