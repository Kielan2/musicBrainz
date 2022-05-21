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


  //Get Genres
  const _getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US&offset=0&limit=50`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + token}
    })

    const data = await result.json()
    console.log(data)
    return data.categories.items
  }

  //Get Playlist
  const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 20

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })

    const data = await result.json()
    return data.playlists.items
  }

  //Get Tracks
  const _getTracks = async (token, tracksEndPoint) => {

    const limit = 20

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })

    const data = await result.json()
    return data.items
  }

  const _getTrack = async (token, trackEndPoint) => {

    const result = await fetch(`${trackEndPoint}`, {
      method: 'Get',
      headers: { 'Authorization' : 'Bearer ' + token}
    })

    const data = await result.json()
    return data
  }
  
  return {
    getToken() {
      return _getToken()
    },
    getGenres(token) {
      return _getGenres(token)
    },
    getPlaylistByGenre(token, genreId) {
      return _getPlaylistByGenre(token, genreId)
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint)
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint)
    }
  }
 })()


 const UIController = (function() {

  const DOMElements = {
    selectGenre: '#select_genre',
    selectPlaylist: '#select_playlist',
    buttonSubmit: '#btn_submit',
    divSongDetail: '#song-detail',
    hfToken: '#hidden_token',
    divSongList: '.song-list'
  }

  return {

    inputField() {
      return {
        genre: document.querySelector(DOMElements.selectGenre),
        playlist: document.querySelector(DOMElements.selectPlaylist),
        songs: document.querySelector(DOMElements.divSongList),
        submit: document.querySelector(DOMElements.buttonSubmit),
        songDetail: document.querySelector(DOMElements.divSongDetail)
      }
    }, 

    createGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`
      document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html)
    },

    createPlaylist(text, value) {
      const html = `<option value="${value}">${text}</option>`
      document.querySelector(DOMElements.selectPlaylist).insertAdjacentElement('beforeend', html)
    },

    createTrack(id, name) {
      const html = `a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`
      document.querySelector(DOMElements.divSongList).insertAdjacentElement('beforeend', html)
    },

    createTrackDetail(img, title, artist) {
      const detailDiv = document.querySelector(DOMElements.divSongDetail)

      detailDiv.innerHTML = ''

      const html = 
      ` <div class="row col-sm-12 px-0">
          <img src="${img}" alt="">
          </div>
          <div class="row col-sm-12 px-0">
            <label for="Genre" class="form-label col-sm-12">${title}:</label>
          </div>
          <div class="row col-sm-12 px-0">
            <label for="artist" class="form-label col-sm-12">By ${artist}:<label>
            </div>`

            detailDiv.insertAdjacentHTML('beforeend', html)
    }, 

    resetTrackDetail() {
      this.inputField().songDetail.innerHTML = ''
    },

    resetTracks() {
      this.inputField().songs.innerHTML = ''
      this.resetTrackDetail()
    },

    resetPlaylist() {
      this.inputField().playlist.innerHTML = ''
      this.resetTracks()
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
    UICtrl.resetPlaylist()
    const token = UICtrl.getStoredToken().token
    const genreSelect = UICtrl.inputField().genre
    const genreId = genreSelect.options[genreSelect.selectedIndex].value
    const playlist = await APICtrl.getPlaylistByGenre(token, genreId)
    playlist.forEach( p => UICtrl.createPlaylist(p.name, p.tracks.href))
  })

  DOMInputs.submit.addEventListener('click', async (e) => {
    e.preventDefault()
    UICtrl.resetTracks()
    const token = UICtrl.getStoredToken().token
    const playlistSelect = UICtrl.inputField().playlist
    const tracksEndPoint = playlist.options[playlistSelect.selectedIndex].value
    const tracks = await APICtrl.getTracks(token, tracksEndPoint)
    tracks.forEach(el.track.href, el.track.name)
  })

  DOMInputs.tracks.addEventListener('click', async (e) => {
    // prevent page reset
    e.preventDefault();
    UICtrl.resetTrackDetail();
    // get the token
    const token = UICtrl.getStoredToken().token;
    // get the track endpoint
    const trackEndpoint = e.target.id;
    //get the track object
    const track = await APICtrl.getTrack(token, trackEndpoint);
    // load the track details
    UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
});    

return {
    init() {
        console.log('App is starting');
        loadGenres();
    }
}

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
