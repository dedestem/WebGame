document.addEventListener("DOMContentLoaded", () => {
    const field = document.getElementById("Field");
    const cells = Array.from(field.getElementsByClassName("Cell"));
    let currentPlayer = "X";
    let gameOver = false;
    const isBotEnabled = window.location.hash === "#Bot";

    if (isBotEnabled) {
        SetFeedback("Bot mode", "rgb(255, 255, 255)");
    } else {
        SetFeedback("Local mode", "rgb(255, 255, 255)");
    }

    window.addEventListener("hashchange", () => {
        window.location.reload();
    });

    // Add a click event to each cell
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);

        // Add hover effect dynamically
        cell.addEventListener("mouseenter", () => updateCellHoverStyle(cell, true));
        cell.addEventListener("mouseleave", () => updateCellHoverStyle(cell, false));
    });

    function handleCellClick(e) {
        if (gameOver) return;
        if (currentPlayer === "O" && isBotEnabled) return; // Ignore clicks during bot's turn

        // Prevent clicking on a cell that already has an icon
        if (e.target.classList.contains("Icon") || e.target.closest('.Cell').querySelector(".Icon")) return;

        makeMove(e.target);

        // If bot is enabled and it's O's turn
        if (isBotEnabled && currentPlayer === "O" && !gameOver) {
            setTimeout(botMove, 500); // Add a small delay for realism
        }
    }

    function makeMove(cell) {
        // Add the icon
        const icon = createIcon();
        cell.appendChild(icon);

        // Check for winner or tie
        if (checkWinner()) {
            endGame(`${currentPlayer} has won!`, currentPlayer);
        } else if (checkTie()) {
            endGame("It's a tie!", "none");
        }

        // Clear hover effects
        cells.forEach(c => {
            c.style.boxShadow = "";
        });

        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateFeedback();
    }

    function botMove() {
        const emptyCells = cells.filter(cell => !cell.querySelector(".Icon"));
    
        // Check if the bot can win
        for (const cell of emptyCells) {
            cell.appendChild(createIcon());
            if (checkWinner()) {
                return;
            }
            cell.removeChild(cell.querySelector(".Icon")); // Undo move
        }
    
        // Check if the bot needs to block the player
        currentPlayer = "X"; // Temporarily switch to the opponent
        for (const cell of emptyCells) {
            cell.appendChild(createIcon());
            if (checkWinner()) {
                currentPlayer = "O"; // Switch back to the bot
                cell.removeChild(cell.querySelector(".Icon")); // Remove the X
                makeMove(cell); // Block the player
                return;
            }
            cell.removeChild(cell.querySelector(".Icon")); // Undo move
        }
        currentPlayer = "O"; // Switch back to the bot
    
        // Otherwise, pick a random empty cell
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomCell);
    }
    

    function updateFeedback() {
        if (currentPlayer === "X") {
            SetFeedback("X Turn", "#00ffff");
        } else {
            SetFeedback("O Turn", "#ff6f91");
        }
    }

    function SetFeedback(text, color) {
        const element = document.getElementById("text");
        element.style.color = color;
        element.textContent = text;
    }

    function createIcon() {
        const icon = document.createElement("div");
        icon.classList.add("Icon", currentPlayer);
        return icon;
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            const icons = [cells[a], cells[b], cells[c]].map(cell => cell.querySelector(".Icon"));
            return icons.every(icon => icon && icon.classList.contains(currentPlayer));
        });
    }

    function checkTie() {
        return cells.every(cell => cell.querySelector(".Icon"));
    }

    function endGame(message, winner) {
        gameOver = true;

        setTimeout(() => {
            if (winner === "X") {
                SetFeedback(message, "#00ffff");
            } else if (winner === "O") {
                SetFeedback(message, "#ff6f91");
            } else {
                SetFeedback(message, "rgb(255, 255, 255)");
            }
        }, 500);

        setTimeout(() => {
            setTimeout(() => flash(winner), 0); 
            setTimeout(() => flash(winner), 550);    
            setTimeout(() => flash(winner), 1050);  
            setTimeout(() => flash(winner), 2050);  
            setTimeout(() => flash(winner), 2550); 
            setTimeout(() => flash(winner), 3550);    
            setTimeout(() => flash(winner), 4050);  
            setTimeout(() => flash(winner), 5550);  
            setTimeout(() => window.location.reload(), 8000);
        }, 1000);
    }

    function flash(winner) {
        console.log(winner);
        cells.forEach(cell => {
            if (winner === "X") {
                cell.style.boxShadow = "0 0 5px #00ffff, 0 0 10px #00ffff";  // Blue for X
            } else if (winner === "O") {
                cell.style.boxShadow = "0 0 5px #ff6f91, 0 0 10px #ff6f91";  // Pink for O
            } else {
                cell.style.boxShadow = "0 0 5px rgb(255, 255, 255), 0 0 10px rgb(255, 255, 255)";
            }
        });

        // Wait function
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Clear the flash effect after some time
        (async () => {
            await wait(500); // Wait for 500ms before removing box shadow
            cells.forEach(cell => {
                cell.style.boxShadow = "";
            });
        })();
    }

    // Dynamically add/remove hover effect based on current player
    function updateCellHoverStyle(cell, isHovering) {
        if (gameOver) return;
        if (cell.querySelector(".Icon")) return; // No hover effect if the game is over or cell is filled

        // Set box-shadow only on hover based on the current player
        if (isHovering) {
            if (currentPlayer === "X") {
                cell.style.boxShadow = "0 0 5px #00ffff, 0 0 10px #00ffff";  // Blue for X
            } else {
                cell.style.boxShadow = "0 0 5px #ff6f91, 0 0 10px #ff6f91";  // Pink for O
            }
        } else {
            cell.style.boxShadow = "";  // Reset the box-shadow when not hovering
        }
    }
});
