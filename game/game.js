// Adicione estas duas novas variáveis no início do arquivo, junto com as outras variáveis globais
const players = JSON.parse(localStorage.getItem('players'));
let currentPlayerIndex = 0;
const playerStats = players.map(player => ({ name: player, acertos: 0, erros: 0 }));
const gameStartTime = new Date().toISOString(); // NOVA LINHA
let gameEndTime; // NOVA LINHA

function updatePlayerInfo() {
    const playerInfoDiv = document.getElementById('player-info');
    playerInfoDiv.innerHTML = `Vez de: ${playerStats[currentPlayerIndex].name}<br>`;
    playerStats.forEach(player => {
        playerInfoDiv.innerHTML += `${player.name} - Acertos: ${player.acertos}, Erros: ${player.erros}<br>`;
    });
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let cards = letters.concat(letters).sort(() => 0.50 - Math.random());
const gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;

cards.forEach(letter => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = letter;
    gameBoard.appendChild(card);
});

setTimeout(() => {
    document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'));
}, 50000);

gameBoard.addEventListener('click', event => {
    if (lockBoard) return;
    const clickedCard = event.target;
    if (clickedCard === firstCard || !clickedCard.classList.contains('card')) return;

    clickedCard.classList.remove('hidden');

    if (!firstCard) {
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    lockBoard = true;

    if (firstCard.textContent === secondCard.textContent) {
        playerStats[currentPlayerIndex].acertos++;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        checkGameCompletion();
    } else {
        playerStats[currentPlayerIndex].erros++;
        setTimeout(() => {
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            updatePlayerInfo();
        }, 1000);
    }
    updatePlayerInfo();
});

// Substitua a função checkGameCompletion existente por esta nova versão
async function checkGameCompletion() {
    const hiddenCards = document.querySelectorAll('.card.hidden');
    if (hiddenCards.length === 0) {
        gameEndTime = new Date().toISOString();
        document.getElementById('congrats-message').style.display = 'block';
        
        // Salva os resultados do jogo
        try {
            const response = await fetch('/api/save-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startTime: gameStartTime,
                    endTime: gameEndTime,
                    players: playerStats
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save game results');
            }

            console.log('Game results saved successfully');
        } catch (error) {
            console.error('Error saving game results:', error);
            alert('Failed to save game results. Please try again.');
        }
    }
}

function restartGame() {
    location.reload();
}

function goBack() {
    window.location.href = '../index.html';
}

document.addEventListener('click', event => {
    if (!event.target.closest('#game-board')) {
        event.stopPropagation();
    }
});

updatePlayerInfo();