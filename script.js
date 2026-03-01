class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        
        this.symbols = ['🍎', '🍌', '🍒', '🍕', '🚗', '🏠', '⭐', '❤️'];
        this.gameBoard = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('message');
        this.restartButton = document.getElementById('restart');
        
        this.init();
    }
    
    init() {
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.startGame();
    }
    
    startGame() {
        this.createCards();
        this.renderCards();
        this.startTimer();
    }
    
    createCards() {
        const gameSymbols = this.symbols.slice(0, 8);
        const cardsArray = [...gameSymbols, ...gameSymbols];
        
        this.shuffleArray(cardsArray);
        
        this.cards = cardsArray.map((symbol, index) => ({
            id: index,
            symbol: symbol,
            flipped: false,
            matched: false
        }));
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    renderCards() {
        this.gameBoard.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${card.symbol}</div>
                    <div class="card-back">?</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(card) {
        if (card.flipped || card.matched || this.flippedCards.length === 2) {
            return;
        }
        
        if (!this.gameStarted) {
            this.gameStarted = true;
        }
        
        card.flipped = true;
        this.flippedCards.push(card);
        
        this.renderCards();
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            
            this.flippedCards = [];
            
            if (this.matchedPairs === 8) {
                this.endGame();
            }
        } else {
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = [];
                this.renderCards();
            }, 1000);
        }
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerElement.textContent = this.timer;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
    
    endGame() {
        this.stopTimer();
        this.showMessage(`Congratulations! You Won!<br>Moves: ${this.moves}<br>Time: ${this.timer} seconds`);
    }
    
    showMessage(text) {
        this.messageElement.innerHTML = text;
        this.messageElement.classList.add('show');
    }
    
    hideMessage() {
        this.messageElement.classList.remove('show');
    }
    
    restartGame() {
        this.stopTimer();
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.gameStarted = false;
        this.timer = 0;
        
        this.movesElement.textContent = '0';
        this.timerElement.textContent = '0';
        this.hideMessage();
        
        this.startGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});