// const APIController = (function() {
  

//   const clientId = ''
//   const clientSecret = ''

//   const _getTOken = async () => {
     
//     const result = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type' : 'application/x-www-form-urlencoded',
//         'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
//       },
//       body: 'grant_type=client_credentials'
//     })

//     const data = await result.json()
//     return data.access_token
//   }

// })()

function giveArtist(){
  let ourArtist = document.querySelector('#artistSearch').value

fetch(`http://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6`)
  .then(response => response.json())
  .then(data => {
      console.log(data)
  })
}