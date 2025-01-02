document.addEventListener("DOMContentLoaded", () => {
    const Input = document.getElementById("Input");
    const Divide = document.getElementById("Divide");
    const Message = document.getElementById("Message");

    Divide.addEventListener("click", () => {
        const Players = parseInt(document.getElementById("Players").value);

        if (isNaN(Players) || Players < 2 || Players > 6 ) {
            Message.style.color = "red";
            Message.innerText = "Invalid amount of players!";
            return;
        }

        Input.style.display = "none";
    });
});
