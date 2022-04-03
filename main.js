const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;

const mbApi = new MusicBrainzApi({
  appName: 'my-app',
  appVersion: '0.1.0',
  appContactInfo: 'user@mail.org'
});

import {MusicBrainzApi} from '../src/musicbrainz-api';

const config = {
  // MusicBrainz bot account username & password (optional)
  botAccount: { 
    username: 'myUserName_bot',
    password: 'myPassword' 
  },
  
  // API base URL, default: 'https://musicbrainz.org' (optional)
  baseUrl: 'https://musicbrainz.org',

  appName: 'my-app',
  appVersion: '0.1.0',

  // Optional, default: no proxy server
  proxy: {
    host: 'localhost',
    port: 8888
   },

  // Your e-mail address, required for submitting ISRCs
  appMail: string
}

const mbApi = new MusicbrainzApi(config);


//Don't touch above this line


const findArtist = document.getElementById('artistSearch').value
findArtist.addEventListener('click', () => {
    const artist = await mbApi.lookupArtist({query: 'ab2528d9-719f-4261-8098-21849222a0f2'});
})