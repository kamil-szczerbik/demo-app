const calculate = require('../../gamesLogic/dicesLogic');

let playersNumber;
let playersUsernames = [];
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
 �a�cuch 1 (Start gry) --- prepareData -> rollTheDices (-> randomizeDicesPositions -> calculate) -> Przypisujemy odpowiednie warto�ci do mo�liwych punkt�w do wzi�cia
*/

//Przypisujemy dane jakie dostajemy z zewn�trz, czyli liczba graczy oraz nazwy u�ytkownik�w
function prepareData(newPlayersNumber, newPlayersUsernames) {
    playersNumber = newPlayersNumber;
    playersUsernames = newPlayersUsernames;
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
    data.score = score;                 //g�upie to
    return data;
}

//Przerzucamy wybrane ko�ci
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

    return data;
}

//Losujemy warto�ci pi�ciu ko�ci, oddelogowujemy do dzia�ania 2 funkcje i sprawdzamy, czy gracz, kt�ry rzuci� ko�cmi ma ju� jakie� warto�ci w tabelce
function rollDices() {
    for (let i = 0; i < 5; i++)
        if (dicesReroll[i] === true)
            dices[i] = Math.floor(Math.random() * 6) + 1;

    randomizeDicesPositions();
    proposedValues = calculate(dices);
    
    for (let i = 0; i < 13; i++) {
        if (score[activePlayer][i] !== null)
            proposedValues[i] = score[activePlayer][i];//Nadpisujemy to co wyliczyli�my, tym co jest ju� w tabelce
    }
}

//Losujemy po�o�enie wzgl�dne ka�dej z ko�ci na planszy, p�niej przeliczamy je na wsp�rz�dne bezwzgl�dne
function randomizeDicesPositions() {
    for (let i = 0; i < 5; i++) {
        if (dicesReroll[i] === true) {
            let g = Math.floor(Math.random() * 25);                 //Losujemy kwadrat jeden z 25 kwadrat�w, w kt�rym znajdzie si� ko��
            if (grid.indexOf(g) === -1 && g !== 22)                 //Je�li wylosowana liczba si� powtarza z kt�r�� z poprzednich lub jest 22 (kwadrat w kt�rym znajduje si� przycisk do przerzucenia ko�ci), powt�rz losowanie
                grid[i] = g;
            else
                i--;
        }
    }

    //Sprawdzi� czy nie da si� tego zmergewa� w jednym ifie.

    for (let i = 0; i < 5; i++) {
        if (dicesReroll[i] === true) {
            const rndX = Math.floor(Math.random() * 29) + 36;       //to jest tak wyliczone, �e przy k�cie 45st. r�g ko�ci mo�e si� styka� z kraw�dzi�
            const rndY = Math.floor(Math.random() * 29) + 36;       //kwadratu (ew. 1px r�nicy, bo nw jak js przelicza przecinkowe i je zaokr�gla)
            //Na wsp�rz�dne bezwzgl�dne
            posArray[0][i] = rndX + (100 * (grid[i] % 5));
            posArray[1][i] = rndY + (100 * (Math.floor(grid[i] / 5)));
            rotArray[i] = Math.floor(Math.random() * 360);
        }
    }
}

//Iterujemy zmienn� activePlayer
function nextPlayer() {
    if (activePlayer === playersNumber - 1)
        activePlayer = 0;
    else
        activePlayer++;

    rollDices();
}

//Koniec gry - sprawdzamy kto wygra� lub czy jest remis
function endGame() {
    let highestScore = score[0][14];
    let winner = [];
    winner[0] = 0;
    let tie = false;
    let summary = {};

    for (let i = 1; i < playersNumber; i++) {
        if (highestScore <= score[i][14]) {
            if (highestScore < score[i][14]) {
                highestScore = score[i][14];
                winner.fill(null);
                winner[0] = i;
                tie = false;
            }
            else {
                tie = true;
                winner[i - 1] = highestScore;
                winner[i] = highestScore;
            }
        }
    }

    if (tie) {
        const usernames = [];
        let i = 0;
        console.log(`Remis pomi�dzy: `)
        while (winner[i++]) {
            console.log(`${playersUsernames[i]}`);
            usernames[i] = playersUsernames[i];
        }
        console.log(`kt�rzy zdobyli po ${highestScore} punkt�w!`);
        summary.usernames = usernames;
    }
    else {
        console.log(`Wygra� ${playersUsernames[winner[0]]} z wynikiem ${highestScore} punkt�w!`);
        summary.winner = playersUsernames[winner[0]];
    }

    summary.highestScore = highestScore;
    summary.score = score;

    return summary;
}

module.exports = {
    prepareData,
    rerollDices,
    setScore
};