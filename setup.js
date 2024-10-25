document.getElementById('num-players').addEventListener('change', function() {
        const numPlayers = this.value;
        const playerNamesDiv = document.getElementById('player-names');
        playerNamesDiv.innerHTML = '';
    
        for (let i = 1; i <= numPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `player${i}`;
            input.placeholder = `Nome do Jogador ${i}`;
            input.required = true;
            playerNamesDiv.appendChild(input);
        }
    });
    
    document.getElementById('setup-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const players = [];
        formData.forEach((value, key) => {
            if (key.startsWith('player')) {
                players.push(value);
            }
        });
        localStorage.setItem('players', JSON.stringify(players));
        window.location.href = 'game.html';
    });
    