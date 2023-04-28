Sideproject to create a dj for our wedding in 2020 to allow guests to search for artists / songs / albums from their phones and add tracks to a playlist. Submitting a track request would update the queue in a separately running player through a websocket.

Got it mostly working before covid canceled our plans :( 
maybe one day I'll finish it.

## How to run locally

### `Prereqs:`
- a spotify account
- a new playlist in spotify
- a spotify developers account, create an app within the developer dashboard to obtain a client id and client secret
- create a `.env` file at the root directory with 
    - `SPOTIFY_CLIENT_ID`
    - `SPOTIFY_SECRET`
    - `PLAYLIST_ID` 
- install docker and make sure it is running

In the project directory, you can run:

### `npm start`
starts the app in a docker container running at `http://localhost:8080`

to search navigate to `http://localhost:8080/search`

to view the player navigate to `http://localhost:8080/player`

