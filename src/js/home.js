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
  const actionList = await getData('https://yts.mx/api/v2/list_movies.json?genre=action');
  const dramaList = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama');
  const animationList = await getData('https://yts.mx/api/v2/list_movies.json?genre=animation');

  actionList.data.movies.forEach((item) =>{
    const HTMLString = videoItemTemplate(item);
    console.log(HTMLString)
  })

  const $animationContainer = document.getElementById('animation');
  const $actionContainer = document.getElementById('action');
  const $dramaContainer = document.getElementById('drama');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $featuringContainer = document.getElementById('feauting');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImg = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  // Templates in JS.
function videoItemTemplate(item){
  return (
    `<div class="primaryPlaylistItem">
  <div class="primaryPlaylistItem-image">
    <img src="${item.medium_cover_image}" />
  </div>
  <h4 class="primaryPlaylistItem-title">${item.title}</h4>
</div>`
  )
}

  // console.log(videoItemTemplate('src/images/covers/bitcoin.jpg', 'Bitcoin'));
  /*
  console.log('Action List:' ,actionList);
  console.log('Drama List:', dramaList);
  console.log('Animation List:', animationList);*/
})()