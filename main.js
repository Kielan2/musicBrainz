 const APIController = (function () {

  const clientId = ''
  const clientSecret = ''
  
  const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    })

    const data = await result.json()
    return data.access_token
  }

  const _getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + token}
    })

    const data = await result.json()
    console.log(data)
    return data.categories.items
  }
  
  return {
    getToken() {
      return _getToken()
    },
    getGenres(token) {
      return _getGenres(token)
    }
  }
 })()


 const UIController = (function() {

  const DOMElements = {
    selectGenre: '#select_genre',
    hfToken: '#hidden_token'
  }

  return {

    inputField() {
      return {
        genre: document.querySelector(DOMElements.selectGenre)
      }
    }, 

    createGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`
      document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html)
    },

    storeToken(value) {
      document.querySelector(DOMElements.hfToken).value = value
    }, 

    getStoredToken() {
      return{
        token: document.querySelector(DOMElements.hfToken).value
      }
    }
  }
 })()


 const APPController = (function(UICtrl, APICtrl) {

  const DOMInputs = UICtrl.inputField()

  const loadGenres = async () => {
    const token = await APICtrl.getToken()
    UICtrl.storeToken(token)
    const genres = await APICtrl.getGenres(token)
    genres.forEach(element => UICtrl.createGenre(element.name, element.id))
  }

  DOMInputs.genre.addEventListener('change', async () => {
    const token = UICtrl.getStoredToken().token
    const genreSelect = UICtrl.inputField().genre
    const genreId = genreSelect.options[genreSelect.selectedIndex].value
  })

  return {
    init() {
      console.log('App is starting')
      loadGenres()
    }
  }
 })(UIController, APIController)

 APPController.init()