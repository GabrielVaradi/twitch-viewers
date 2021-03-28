const express = require('express');
const SocketServer = require('ws').Server;
const axios = require('axios')
const fetch = require('node-fetch');
const path = require("path")
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;

const server = app.use(express.static(path.join(__dirname, 'Client/build'))).listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/Client/build/index.html'));
});

const wss = new SocketServer({
    server
}); 

let getToken

let series = [
    {
      name: 'Chess',
      data: [],
      url: "https://api.twitch.tv/helix/streams/?first=100&game_id=743",
      dataType: "live-count"
    },
    {
      name: 'Dota',
      data: [],
      url: "https://api.twitch.tv/helix/streams/?first=100&game_id=29595",
      dataType: "live-chart"
    },
    {
      name: 'RocketLeague',
      data: [],
      url: "https://api.twitch.tv/helix/streams/?first=100&game_id=30921",
      dataType: "live-chart"
    },
    {
      name: 'Hearthstone',
      data: [],
      url: "https://api.twitch.tv/helix/streams/?first=100&game_id=138585",
      dataType: "live-chart"
    },
]

  
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});
  
setInterval(() => {
    clearSeriesData()
},  7200000);

setInterval(async () => {
    await fetchData()
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({series}));
    });
},  2000);

clearSeriesData = () => {
    for (serie of series) {
        serie.data = []
    }
}
  
updateSeriesData = (prevViewers, updatedViewers) => {
      const oldSeriesData = [...prevViewers]
      const newSeriesData = oldSeriesData
      newSeriesData.push(updatedViewers)
      return newSeriesData
}
    
updateData = (chessViewers, dotaViewers, rocketLeagueViewers, hearthstoneViewers) => {
    
    for (let serie of series) {
        if (serie.name === "Chess") {
            const currentChessViewers = chessViewers
            serie.data = currentChessViewers
        }
        else if (serie.name === "Dota") {
            const currentDotaViewers = updateSeriesData(serie.data, dotaViewers)
            serie.data = currentDotaViewers
        }
        else if (serie.name === "RocketLeague") {
            const currentRocketLeagueViewers = updateSeriesData(serie.data, rocketLeagueViewers)
            serie.data = currentRocketLeagueViewers
        }
        else if (serie.name === "Hearthstone") {
            const currentHearthstoneViewers = updateSeriesData(serie.data, hearthstoneViewers)
            serie.data = currentHearthstoneViewers
        }            
    } 
}

sumViewers = (data) => {
    
    let totalViewers = 0
    for (let stream of data.data) {
        totalViewers += stream.viewer_count
    }
    return totalViewers
}

fetchData = async () => {
    if (!getToken) {
        getToken = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_API_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_API_CLIENT_SECRET}&grant_type=client_credentials&scope=analytics:read:games`)
        .then(response => response)
        .catch(e => console.log(e))
    } else {
        setInterval(async () => {
            getToken = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_API_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_API_CLIENT_SECRET}&grant_type=client_credentials&scope=analytics:read:games`)
            .then(response => response)
            .catch(e => console.log(e))
        },  12600000);
    }

    const data = await Promise.all(series.map(serie => {
        return fetch(serie.url, {
            "headers": {
                    "Client-ID": process.env.REACT_APP_TWITCH_API_CLIENT_ID,
                    "Authorization": "Bearer " + getToken.data.access_token
            }
        }).then(resp => resp.json())}
        )).catch(e => console.log(e))


    const chessViewers = sumViewers(data[0])
    const dotaViewers = sumViewers(data[1])
    const rocketLeagueViewers = sumViewers(data[2])
    const hearthstoneViewers = sumViewers(data[3])

    updateData(chessViewers, dotaViewers, rocketLeagueViewers, hearthstoneViewers)
}


