class Memorama {
    constructor() {
        this.canPlay = false;
        this.card1 = null;
        this.card2 = null;
        this.availableImages = [16, 7, 102, 103, 104, 105, 106, 107];
        this.orderForThisRound = [];
        this.cards = Array.from(document.querySelectorAll(".board-game figure"));
        this.maxPairNumber = this.availableImages.length;
        this.attempts = 0;
        this.hits = 0; // Nuevo contador de aciertos
        this.hitsDisplay = document.querySelector(".hits"); // Elemento HTML para mostrar los aciertos
        this.startGame();
    }

    startGame() {
        this.foundPairs = 0;
        this.attempts = 0;
        this.hits = 0; // Reiniciar el contador de aciertos al comenzar un nuevo juego
        this.setNewOrder();
        this.setImagesInCards();
        this.openCards();
    }

    setNewOrder() {
        this.orderForThisRound = this.availableImages.concat(this.availableImages);
        this.orderForThisRound.sort(() => Math.random() - 0.5);
    }

    setImagesInCards() {
        for (const key in this.cards) {
            const card = this.cards[key];
            const image = this.orderForThisRound[key];
            const imgLabel = card.children[1].children[0];
            card.dataset.image = image;
            imgLabel.src = `./IM/${image}.PNG`;
        }
    }

    openCards() {
        this.cards.forEach((card) => card.classList.add("opened"));
        setTimeout(() => {
            this.closeCards();
        }, 10000);
    }

    closeCards() {
        this.cards.forEach((card) => card.classList.remove("opened"));
        this.addClickEvents();
        this.canPlay = true;
    }

    addClickEvents() {
        this.cards.forEach((_this) => _this.addEventListener("click", this.flipCard.bind(this)));
    }

    removeClickEvents() {
        this.cards.forEach((_this) => _this.removeEventListener("click", this.flipCard));
    }

    flipCard(e) {
        const clickedCard = e.target;
        if (this.canPlay && !clickedCard.classList.contains("opened")) {
            clickedCard.classList.add("opened");
            this.checkPair(clickedCard.dataset.image);
        }
    }

    checkPair(image) {
        if (!this.card1) this.card1 = image;
        else this.card2 = image;

        if (this.card1 && this.card2) {
            if (this.card1 === this.card2) {
                this.canPlay = false;
                setTimeout(this.checkIfWon.bind(this), 300);
                this.hits++; 
                this.updateHitsDisplay(); 
            } else {
                this.canPlay = false;
                setTimeout(this.resetOpenedCards.bind(this), 800);
                this.attempts++;
                if (this.attempts >= 3) {
                    this.gameOver();
                }
            }
        }
    }

    resetOpenedCards() {
        const firstOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card1}']`);
        const secondOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card2}']`);
        firstOpened.classList.remove("opened");
        secondOpened.classList.remove("opened");
        this.card1 = null;
        this.card2 = null;
        this.canPlay = true;
    }

    checkIfWon() {
        this.foundPairs++;
        this.card1 = null;
        this.card2 = null;
        this.canPlay = true;
        if (this.maxPairNumber === this.foundPairs) {
            alert("¡Ganaste!");
            this.setNewGame();
        }
    }

    setNewGame() {
        this.removeClickEvents();
        this.cards.forEach((card) => card.classList.remove("opened"));
        setTimeout(this.startGame.bind(this), 1000);
    }

    gameOver() {
        alert("¡Perdiste! Has excedido el número máximo de intentos.");
        this.setNewGame();
    }

    updateHitsDisplay() {
        this.hitsDisplay.textContent = `Aciertos: ${this.hits}`;
    }

   
}

document.addEventListener("DOMContentLoaded", () => {
    new Memorama();
});


