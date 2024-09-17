const express = require('express'); 
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/getGameData', async (req, res) => {
  const gameName = req.query.gameName;

  if (!gameName) {
    return res.status(400).send('El nombre del juego es requerido');
  }

  const encodedGameName = encodeURIComponent(gameName);

  const urlSteam = `https://steam2.p.rapidapi.com/search/${encodedGameName}/page/1`;
  const urlEpic = `https://epic-games-store.p.rapidapi.com/search/${encodedGameName}/page/1/country/US/locale/en`;

  const optionSteam = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'daafbb42afmsh400d36368e336d3p1c1be9jsnafd46a3c5ef0',
      'x-rapidapi-host': 'steam2.p.rapidapi.com'
    }
  };

  const optionEpic = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'daafbb42afmsh400d36368e336d3p1c1be9jsnafd46a3c5ef0',
      'x-rapidapi-host': 'epic-games-store.p.rapidapi.com'
    }
  };

  try {
    const [steamResponse, epicResponse] = await Promise.all([
      fetch(urlSteam, optionSteam),
      fetch(urlEpic, optionEpic)
    ]);

    const steamData = await steamResponse.json();
    const epicData = await epicResponse.json();

    const steamTitles = steamData.map(game => game.title);
    const epicTitles = epicData.Catalog.searchStore.elements.map(element => element.title);

    const combinedTitles = {
      steam: steamTitles,
      epic: epicTitles
    };

    res.json(combinedTitles);
  } catch (error) {
    console.error('Error combinando las APIs:', error);
    res.status(500).send('Error al obtener datos de las APIs');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
