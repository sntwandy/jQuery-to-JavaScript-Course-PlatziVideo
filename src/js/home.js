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
})