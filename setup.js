// Adiciona um evento ao elemento com id 'num-players' que será disparado quando o valor mudar
document.getElementById('num-players').addEventListener('change', function() {
        const numPlayers = this.value; // Obtém número de jogadores
        const playerNamesDiv = document.getElementById('player-names'); // nomes dos jogadores serão inseridos
        playerNamesDiv.innerHTML = ''; 
    
        // Verifica se o número de jogadores é menor que 1 ou maior que 4
        if (numPlayers < 1 || numPlayers > 4) {
            //alert("O número de jogadores deve ser entre 1 e 4.");
        } else {
            // Cria campos de entrada para o número de jogadores especificado
            for (let i = 1; i <= numPlayers; i++) {
                const input = document.createElement('input'); 
                input.type = 'text';
                input.name = `player${i}`; 
                input.placeholder = `Nome do Jogador ${i}`; 
                input.required = true; 
                playerNamesDiv.appendChild(input); 
            }
        } 
    });
    
    // Adiciona um evento ao formulário com id 'setup-form' que será disparado quando o formulário for enviado
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
    