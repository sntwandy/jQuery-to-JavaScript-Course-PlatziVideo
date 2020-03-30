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
