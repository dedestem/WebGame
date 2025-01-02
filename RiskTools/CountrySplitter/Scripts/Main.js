document.addEventListener("DOMContentLoaded", () => {
    const Input = document.getElementById("Input");
    const Divide = document.getElementById("Divide");
    const Message = document.getElementById("Message");
    const Result = document.getElementById("Result");
    let OriginalCards = {};

    // Fetch cards for the selected language
    const FetchCards = async (language) => {
        try {
            const response = await fetch(`Cards_${language}.json`);
            const data = await response.json();
            OriginalCards[language] = data;
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    };

    FetchCards("en");
    FetchCards("nl");

    // Shuffle function using Fisher-Yates algorithm
    const shuffleCards = (cards) => {
        const shuffled = [...cards]; // Create a copy of the cards
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap the elements
        }
        return shuffled;
    };

    Divide.addEventListener("click", () => {
        let Players = parseInt(document.getElementById("Players").value);
        let GhostEnabled = false;

        // Add Ghost player if there are 2 players (original count was 2)
        if (Players === 2) {
            Players = 3; // Add one Ghost player (total 3 players)
            GhostEnabled = true;
        }

        // Validate player count
        if (isNaN(Players) || Players < 2 || Players > 6) {
            Message.style.color = "red";
            Message.innerText = "Invalid amount of players!";
            return;
        }

        const selectedRadio = document.querySelector('input[name="language"]:checked');
        if (!selectedRadio) {
            Message.style.color = "red";
            Message.innerText = "Please select a language!";
            return;
        }

        const Language = selectedRadio.value;

        if (!OriginalCards[Language]) {
            Message.style.color = "red";
            Message.innerText = `No data found for the selected language: ${Language}`;
            return;
        }

        // Hide the input form
        Input.style.display = "none";

        // Shuffle the cards
        const cardsArray = Object.values(OriginalCards[Language]);
        const shuffledCards = shuffleCards(cardsArray);

        // Ensure that each player gets an equal number of cards
        const cardsPerPlayer = Math.floor(shuffledCards.length / Players);
        const leftoverCards = shuffledCards.length % Players;

        // Create a 2D array to store each player's cards
        let playersCards = Array.from({ length: Players }, () => []);

        // Distribute cards evenly
        for (let i = 0; i < shuffledCards.length; i++) {
            playersCards[i % Players].push(shuffledCards[i]);
        }

        // Clear previous results
        Result.innerHTML = '';

        // Create a column for each player
        playersCards.forEach((playerCards, playerIndex) => {
            // Create a container for the player's column
            const playerColumn = document.createElement("div");
            playerColumn.classList.add("player-column");

            // Add the player's title
            const playerTitle = document.createElement("h3");
            if (GhostEnabled && playerIndex === 2) {
                playerTitle.innerText = `Ghost Player`;  // Player 3 (index 2) is the Ghost player
            } else {
                playerTitle.innerText = `Player ${playerIndex + 1}`;
            }
            playerColumn.appendChild(playerTitle);

            // Add cards to the player's column
            playerCards.forEach((card) => {
                const cardElement = document.createElement("div");
                cardElement.classList.add("card");
                cardElement.innerHTML = `
                    <div class="card-country">${card.Country}</div>
                    <div class="card-troup">${card.Troup}</div>
                `;
                playerColumn.appendChild(cardElement);
            });

            // Append the player's column to the result div
            Result.appendChild(playerColumn);
        });
    });
});
