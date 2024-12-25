document.addEventListener("DOMContentLoaded", () => {
    const field = document.getElementById("Field");
    const cells = Array.from(field.getElementsByClassName("Cell"));
    let currentPlayer = "X";
    let gameOver = false;

    // Voeg een klikgebeurtenis toe aan elke cel
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);

        // Add hover effect dynamically
        cell.addEventListener("mouseenter", () => updateCellHoverStyle(cell, true));
        cell.addEventListener("mouseleave", () => updateCellHoverStyle(cell, false));
    });

    function handleCellClick(e) {
        // Prevent clicking on a cell that already has an icon or if the game is over
        if (e.target.classList.contains("Icon") || e.target.closest('.Cell').querySelector(".Icon")) return;
    
        // Add the icon
        const icon = createIcon();
        e.target.appendChild(icon);
    
        // Check for winner or tie
        if (checkWinner()) {
            endGame(`${currentPlayer} heeft gewonnen!`);
        } else if (checkTie()) {
            endGame("Het is een gelijkspel!");
        }
    
        // Clear hover effects
        cells.forEach(cell => {
            cell.style.boxShadow = "";
        });
    
        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    

    function createIcon() {
        const icon = document.createElement("div");
        icon.classList.add("Icon", currentPlayer);
        return icon;
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontaal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticaal
            [0, 4, 8], [2, 4, 6]             // Diagonaal
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

    function endGame(message) {
        alert(message);
        gameOver = true;
    }

    // Dynamically add/remove hover effect based on current player
    function updateCellHoverStyle(cell, isHovering) {
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
