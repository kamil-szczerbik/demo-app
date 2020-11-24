const calculate = require('../../gamesLogic/dicesLogic');

let playersNumber;
let playersUsernames = [];
let roundsNumber;
let victories;
let activePlayer;
let dicesReroll = [];
const dices = [];
const grid = [];
const posArray = [[], []];
const rotArray = [];
let proposedValues = [];
let score = [];
let rollNumber;
let endIndicator;

let data = {};

/*
 Łańcuch 1 (Start gry) --- prepareData -> rollTheDices (-> randomizeDicesPositions -> calculate) -> Przypisujemy odpowiednie wartości do możliwych punktów do wzięcia
*/

//Przypisujemy dane jakie dostajemy z zewnątrz, czyli liczba graczy oraz nazwy użytkowników
function prepareData(newPlayersNumber, newPlayersUsernames, newRoundsNumber) {
    playersNumber = newPlayersNumber;
    playersUsernames = newPlayersUsernames;
    roundsNumber = newRoundsNumber;
    victories = Array(playersNumber).fill(0);

    activePlayer = 0;
    rollNumber = 0;
    endIndicator = 0;
    dicesReroll = [true, true, true, true, true];

    for (let i = 0; i < playersNumber; i++)
        score[i] = Array(15).fill(null);

    rollDices();
    data.proposedValues = proposedValues;
    data.posArray = posArray;
    data.rotArray = rotArray;
    data.rollNumber = rollNumber;
    data.dices = dices;
    data.activePlayer = activePlayer;
    data.score = score;                 //głupie to
    return data;
}

//Przerzucamy wybrane kości
function rerollDices(newDicesReroll) {
    dicesReroll = newDicesReroll;
    rollNumber++;

    rollDices();
    data.proposedValues = proposedValues;
    data.posArray = posArray;
    data.rotArray = rotArray;
    data.rollNumber = rollNumber;
    data.dices = dices;
    data.activePlayer = activePlayer;
    data.score = score;
    return data;
}


function setScore(chosenValue) {
    const newScore = score;
    newScore[activePlayer][chosenValue] = proposedValues[chosenValue];

    if (chosenValue < 6) {
        newScore[activePlayer][13] += newScore[activePlayer][chosenValue];
        if (newScore[activePlayer][13] > 62)
            newScore[activePlayer][13] += 30;
    }

    newScore[activePlayer][14] += newScore[activePlayer][chosenValue];
    score = newScore;

    if (activePlayer === playersNumber - 1) {
        endIndicator++;
        if (endIndicator === 13) {
            const summary = endGame();
            return summary;
        }
    }

    data.score = score;

    grid.fill(undefined);
    dicesReroll.fill(true);
    dices.fill(undefined);
    rollNumber = 0;

    nextPlayer();

    data.rollNumber = rollNumber;
    data.posArray = posArray;
    data.rotArray = rotArray;
    data.dices = dices;
    data.proposedValues = proposedValues;
    data.activePlayer = activePlayer;
    data.end = false;

    return data;
}

//Losujemy wartości pięciu kości, oddelogowujemy do działania 2 funkcje i sprawdzamy, czy gracz, który rzucił koścmi ma już jakieś wartości w tabelce
function rollDices() {
    for (let i = 0; i < 5; i++)
        if (dicesReroll[i] === true)
            dices[i] = Math.floor(Math.random() * 6) + 1;

    randomizeDicesPositions();
    proposedValues = calculate(dices);
    
    for (let i = 0; i < 13; i++) {
        if (score[activePlayer][i] !== null)
            proposedValues[i] = score[activePlayer][i];//Nadpisujemy to co wyliczyliśmy, tym co jest już w tabelce
    }
}

//Losujemy położenie względne każdej z kości na planszy, później przeliczamy je na współrzędne bezwzględne
function randomizeDicesPositions() {
    for (let i = 0; i < 5; i++) {
        if (dicesReroll[i] === true) {
            let g = Math.floor(Math.random() * 25);                 //Losujemy kwadrat jeden z 25 kwadratów, w którym znajdzie się kość
            if (grid.indexOf(g) === -1 && g !== 22)                 //Jeśli wylosowana liczba się powtarza z którąś z poprzednich lub jest 22 (kwadrat w którym znajduje się przycisk do przerzucenia kości), powtórz losowanie
                grid[i] = g;
            else
                i--;
        }
    }

    //Sprawdzić czy nie da się tego zmergewać w jednym ifie.

    for (let i = 0; i < 5; i++) {
        if (dicesReroll[i] === true) {
            const rndX = Math.floor(Math.random() * 29) + 36;       //to jest tak wyliczone, że przy kącie 45st. róg kości może się stykać z krawędzią
            const rndY = Math.floor(Math.random() * 29) + 36;       //kwadratu (ew. 1px różnicy, bo nw jak js przelicza przecinkowe i je zaokrągla)
            //Na współrzędne bezwzględne
            posArray[0][i] = rndX + (100 * (grid[i] % 5));
            posArray[1][i] = rndY + (100 * (Math.floor(grid[i] / 5)));
            rotArray[i] = Math.floor(Math.random() * 360);
        }
    }
}

//Iterujemy zmienną activePlayer
function nextPlayer() {
    if (activePlayer === playersNumber - 1)
        activePlayer = 0;
    else
        activePlayer++;

    rollDices();
}

//Koniec gry - sprawdzamy kto wygrał lub czy jest remis
function endGame() {
    const winners = [];
    let highestScore = score[0][14];
    let trueEnd = false;
    let tie;
    let message;
    let obj = {};
    obj.end = true;
    winners[0] = playersUsernames[0];



    for (let i = 1; i < playersNumber; i++) {
        if (score[i][14] > highestScore) {
            highestScore = score[i][14];
            winners.fill(undefined);
            winners[i] = playersUsernames[i];
            tie = false;
        }
        else if (score[i][14] === highestScore) {
            winners[i] = playersUsernames[i];
            tie = true;
        }
    }

    if (!tie) {
        for (let i = 0; i < playersNumber; i++) {
            if (winners[i]) {
                victories[i] += 1;
                message = `Wygrał ${winners[i]} z wynikiem ${highestScore} punktów!`;
                break;
            }
        }
    }
    else {
        message = `Remis pomiędzy`
        for (let i = 0; i < playersNumber; i++) {
            if (winners[i]) {
                victories[i] += 1;
                message += ` ${winners[i]},`;
            }
        }
        message += ` , którzy zdobyli po ${highestScore} punktów!`;
    }

    for (let i = 0; i < playersNumber; i++) {
        if (victories[i] === roundsNumber) {
            trueEnd = true;
            /*obj.winners = winners;*/
            obj.lastScore = score;

            break;
        }
        else {
            trueEnd = false;
        }
    }
    grid.fill(undefined);
    dicesReroll.fill(true);
    dices.fill(undefined);
    rollNumber = 0;

    endIndicator = 0;
    proposedValues = Array(13).fill(null);

    for (let i = 0; i < playersNumber; i++)
        score[i] = Array(15).fill(null);

    nextPlayer();
    obj.score = score;
    obj.rollNumber = rollNumber;
    obj.posArray = posArray;
    obj.rotArray = rotArray;
    obj.dices = dices;
    obj.proposedValues = proposedValues;
    obj.activePlayer = activePlayer;
    obj.trueEnd = trueEnd;
    obj.message = message;

    return obj;
}

module.exports = {
    prepareData,
    rerollDices,
    setScore
};