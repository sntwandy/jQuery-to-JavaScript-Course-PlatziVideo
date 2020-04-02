// Adding playlists elements from the API to the DOM.
(async function loadingPlayLists(){
const $playlist = document.getElementById('playlist');
  
async function getUsersData(url){
    const response = await fetch(url);
    const user = await response.json();
    return user;
  }

  // My Users Array
  const {results: usersList} = await getUsersData('https://randomuser.me/api/?results=8');

  // Creating HTML String Template
  function playListTemplate(user){
    return (
      `<li class="playlistFriends-item">
          <a href="#">
            <img src="${user.picture.thumbnail}" alt="echame la culpa" />
            <span>${user.name.first} ${user.name.last}</span>
            </a>
        </li>`
    )
  }

// Creating the HTML Template with the HTML String
  function playListHTMLTemplate(HTMLString){
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0]
  }

// Adding the HTML Template to the DOM.
  function addingListUsers(users){
    for(let i = 0; i < users.length; i++){
      const HTMLString = playListTemplate(users[i])
      const HTMLTemplate = playListHTMLTemplate(HTMLString);
      $playlist.append(HTMLTemplate);
    }
  }

  // Calling the Fn to add playlist element from API.
  addingListUsers(usersList)
})()


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
    if(data.data.movie_count > 0){
      return data;
    }
    throw new Error('No encontro ningun resultado');
  }
  const BASE_API = 'https://yts.mx/api/v2/';

  const $animationContainer = document.getElementById('animation');
  const $actionContainer = document.getElementById('action');
  const $dramaContainer = document.getElementById('drama');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $featuringContainer = document.getElementById('featuring');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');

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
      const image = movieElement.querySelector('img');
      $container.append(movieElement);
      image.addEventListener('load', (event) => event.target.classList.add('fadeIn'));
      addEventClick(movieElement);
      //console.log(HTMLString)
    })
  }

  async function cacheExist(category){
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);

    if(cacheList){
      return JSON.parse(cacheList);
    } else {
      const {data:{movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`);
      window.localStorage.setItem(listName ,JSON.stringify(data));
      return data
    }
  }

  // const {data:{movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`);
  let actionList = await cacheExist('action');
  renderMovieList(actionList, $actionContainer, 'action');
  
  let dramaList = await cacheExist('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');
  
  let animationList = await cacheExist('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

// This function is for refresh de data each 10 minutes.  
  (async function refreshData(){
     setTimeout( async ()=>{
      window.localStorage.clear();
      actionList = await cacheExist('action');
      dramaList = await cacheExist('drama');
      animationList = await cacheExist('animation');

      // The data was refresh each 10 minutes.
      refreshData();
    }, 100000)
  })()


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
    try{
      const {
        data:{
          movies: movieData
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
      const HTMLString = featuringTemplate(movieData[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch(error){
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
  });

  const $modalTitle = $modal.querySelector('h1');
  const $modalImg = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

 

function findById(list, id){
  return list.find( item => item.id === parseInt(id, 10));
}

function findMovie(id, category){
  switch(category){
    case 'action': return findById(actionList, id);
      break;
    case 'drama': return findById(dramaList, id);
      break;
    case 'animation': return findById(animationList, id);
      break;
    default: alert('Error 404 Not found, try again. :(');      
  }
}

function showModal($element){
  $overlay.classList.add('active');
  $modal.style.animation = 'modalIn .8s forwards';

  // getting the id and category to the element from the DOM with dataset
  const id = $element.dataset.id;
  const category = $element.dataset.category;
  const movieData = findMovie(id, category);
  // Writting the content to the DOM.
  $modalTitle.textContent = movieData.title;
  $modalImg.setAttribute('src', movieData.medium_cover_image);
  $modalDescription.textContent = movieData.description_full;
}

$hideModal.addEventListener('click', () => {
  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .8s forwards';
})

  // console.log(videoItemTemplate('src/images/covers/bitcoin.jpg', 'Bitcoin'));
  /*
  console.log('Action List:' ,actionList);
  console.log('Drama List:', dramaList);
  console.log('Animation List:', animationList);*/
})()