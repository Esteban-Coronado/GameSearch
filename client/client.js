document.getElementById('gameForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const gameName = document.getElementById('gameName').value;
    const steamTitlesList = document.getElementById('steamTitles');
    const epicTitlesList = document.getElementById('epicTitles');

    steamTitlesList.innerHTML = '';
    epicTitlesList.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:3000/getGameData?gameName=${encodeURIComponent(gameName)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.steam.length > 0) {
            data.steam.forEach(title => {
                const li = document.createElement('li');
                li.textContent = title;
                steamTitlesList.appendChild(li);
            });
        } else {
            steamTitlesList.innerHTML = '<li>Titulo no encontrados en Steam</li>';
        }

        if (data.epic.length > 0) {
            data.epic.forEach(title => {
                const li = document.createElement('li');
                li.textContent = title;
                epicTitlesList.appendChild(li);
            });
        } else {
            epicTitlesList.innerHTML = '<li>Titulo no encontrados en Epic</li>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        steamTitlesList.innerHTML = '<li>Error al obtener los títulos de Steam</li>';
        epicTitlesList.innerHTML = '<li>Error al obtener los títulos de Epic</li>';
    }
});
