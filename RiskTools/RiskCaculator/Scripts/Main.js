document.addEventListener("DOMContentLoaded", () => {
    const Input = document.getElementById("Input");
    const Calculate = document.getElementById("Calculate");
    const Message = document.getElementById("Message");
    const ResultContainer = document.getElementById("Result");

    // Initialize the result container to be hidden
    ResultContainer.style.display = "none";

    Calculate.addEventListener("click", () => {
        const Attacker = parseInt(document.getElementById("Attacker").value);
        const Defender = parseInt(document.getElementById("Defender").value);
        const GiveUp = parseInt(document.getElementById("GiveUp").value);

        if (isNaN(Attacker) || Attacker < 2) {
            Message.style.color = "red";
            Message.innerText = "Invalid attacker troops!";
            return;
        }
        if (isNaN(Defender) || Defender < 1) {
            Message.style.color = "red";
            Message.innerText = "Invalid defender troops!";
            return;
        }
        if (isNaN(GiveUp) || GiveUp < 1) {
            Message.style.color = "red";
            Message.innerText = "Invalid give up value!";
            return;
        }

        // Hide input and show result container
        Input.style.display = "none";
        ResultContainer.style.display = "flex";
        Roll(Attacker, Defender, GiveUp);
    });
});

function RollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function Roll(AttackerT, DefenderT, GiveUp) {
    let Attacker = AttackerT;
    let Defender = DefenderT;

    while (Attacker > 1 && Defender > 0 && Attacker > GiveUp) {
        let attackerDice = [];
        let defenderDice = [];

        // Decide number of dice based on the number of troops
        if (Attacker < 3) {
            attackerDice.push(RollDice());
            defenderDice.push(RollDice(), RollDice());
        } else {
            attackerDice.push(RollDice(), RollDice());
            defenderDice.push(RollDice(), RollDice(), RollDice());
        }

        // Sort the dice results in descending order
        attackerDice.sort((a, b) => b - a);
        defenderDice.sort((a, b) => b - a);

        // Compare the dice rolls
        for (let i = 0; i < Math.min(attackerDice.length, defenderDice.length); i++) {
            if (attackerDice[i] > defenderDice[i]) {
                Defender--;
            } else {
                Attacker--;
            }
        }

        Log(Attacker, Defender, attackerDice, defenderDice);
    }

    const EndMSG = document.getElementById("EndMSG");

    if (Attacker <= GiveUp) {
        EndMSG.style.color = "white";
        EndMSG.innerText = "Attacker gave up!";
    } else if (Defender < 1) {
        EndMSG.style.color = "red";
        EndMSG.innerText = "Attacker wins!";
    } else {
        EndMSG.style.color = "lightblue";
        EndMSG.innerText = "Defender wins!";
    }

    const AtOver =  AttackerT - Attacker
    const DefOver = DefenderT - Defender

    document.getElementById("AttackOver").innerText = "-" + AtOver + "(" + Attacker + ")";
    document.getElementById("DefenderOver").innerText = "-" + DefOver + "(" + Defender + ")";
}

function Log(Attacker, Defender, attackerDice, defenderDice) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'Result';

    // Create Attacker section with updated dice rolls
    const attackerDiv = createSection('Attacker', 'red', Attacker, attackerDice);

    // Create Defender section with updated dice rolls
    const defenderDiv = createSection('Defender', 'lightblue', Defender, defenderDice);

    // Append sections to the result container
    resultDiv.appendChild(attackerDiv);
    resultDiv.appendChild(defenderDiv);

    // Append result div to the "Result" container
    document.getElementById("Result").appendChild(resultDiv);
}

function createSection(title, color, troopCount, diceRolls) {
    const sectionDiv = document.createElement('div');

    // Info part
    const infoDiv = document.createElement('div');
    const titleSpan = document.createElement('span');
    titleSpan.style.color = color;
    titleSpan.textContent = title;

    const paddingDiv = document.createElement('div');
    paddingDiv.style.paddingTop = '1.4vh';

    const statsSpan = document.createElement('span');
    statsSpan.style.paddingLeft = '1vw';
    statsSpan.textContent = `${troopCount} troops remaining`;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(paddingDiv);
    infoDiv.appendChild(statsSpan);

    // Dice roll images
    const diceDiv = document.createElement('div');
    const dicePaddingDiv = document.createElement('div');
    dicePaddingDiv.style.paddingTop = '2.4vh';

    diceRolls.forEach(roll => {
        const img = document.createElement('img');
        img.src = `Images/${roll}.svg`;  // Use the rolled number for the image (1-6)
        diceDiv.appendChild(img);
    });

    sectionDiv.appendChild(infoDiv);
    sectionDiv.appendChild(diceDiv);

    return sectionDiv;
}