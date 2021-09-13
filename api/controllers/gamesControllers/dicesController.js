const dicesLogic = require('../../gamesLogic/dicesLogic');

let playersNumber;
let playersUsernames = [];
let activePlayer;

let turnNumber;
let rollNumber;

const dices = [];
const grid = [];
const dicesPosition = [[], []];
const dicesRotation = [];
let dicesToReroll = [];

let proposedPoints = [];
let score = [[], []];

const winners = [];
let highestScore;
let winnerMessage;
let tie;

let roundsNumber;
let victories;

function startNewGame(newPlayersNumber, newPlayersUsernames, newRoundsNumber) {
    setInitialValues(newPlayersNumber, newPlayersUsernames, newRoundsNumber);
    return data = manageRoll();
}

function rerollDices(newDicesToReroll) {
    dicesToReroll = newDicesToReroll;
    rollNumber++;
    return data = manageRoll();
}

function endTurn(pointsIndex) {
    addPoints(pointsIndex);
    const roundEnd = checkTurnNumber();

    if (!roundEnd) {
        prepareDataForNextTurn();
        setNextPlayer();
        return data = manageRoll();
    }
    else
        return data = endRound();
}

function setInitialValues(newPlayersNumber, newPlayersUsernames, newRoundsNumber) {
    playersNumber = newPlayersNumber;
    playersUsernames = newPlayersUsernames;
    roundsNumber = newRoundsNumber;

    victories = Array(playersNumber).fill(0);
    dicesToReroll = Array(5).fill(true);

    activePlayer = 0;
    turnNumber = 0;
    endIndicator = 0;

    for (let i = 0; i < playersNumber; i++)
        score[i] = Array(15).fill(null);
}

function manageRoll() {
    rollDices();
    randomizeGrids();
    randomizePositionAndRotation();
    proposedPoints = dicesLogic(dices);
    checkProposedPointsAgainstScore();
    return data = prepareDataToReturn();
}

function rollDices() {
    for (let i = 0; i < 5; i++)
        if (dicesToReroll[i])
            dices[i] = Math.floor(Math.random() * 6) + 1;
}

function randomizeGrids() {
    for (let i = 0; i < 5; i++) {
        if (dicesToReroll[i]) {
            let newGrid = Math.floor(Math.random() * 25);

            if (grid.indexOf(newGrid) === -1 && newGrid !== 22)
                grid[i] = newGrid;
            else
                i--;
        }
    }
}

function randomizePositionAndRotation() {
    for (let i = 0; i < 5; i++) {
        if (dicesToReroll[i]) {
            const rndX = Math.floor(Math.random() * 29) + 36;
            const rndY = Math.floor(Math.random() * 29) + 36;
            dicesPosition[0][i] = rndX + (100 * (grid[i] % 5));
            dicesPosition[1][i] = rndY + (100 * (Math.floor(grid[i] / 5)));
            dicesRotation[i] = Math.floor(Math.random() * 360);
        }
    }
}

function checkProposedPointsAgainstScore() {
    for (let i = 0; i < 13; i++)
        if (score[activePlayer][i] !== null)
            proposedPoints[i] = score[activePlayer][i];
}

function prepareDataToReturn() {
    const data = {};

    data.dices = dices;
    data.dicesPosition = dicesPosition;
    data.dicesRotation = dicesRotation;
    data.rollNumber = rollNumber;
    data.activePlayer = activePlayer;
    data.proposedPoints = proposedPoints;
    data.score = score[activePlayer];

    return data;
}

function addPoints(pointsIndex) {
    score[activePlayer][pointsIndex] = proposedPoints[pointsIndex];

    if (pointsIndex < 6)
        summurizeUpperSection(pointsIndex);

    summurizeBothSections(pointsIndex);
}

function summurizeUpperSection(pointsIndex) {
    score[activePlayer][13] += score[activePlayer][pointsIndex];

    if (score[activePlayer][13] > 62)
        score[activePlayer][13] += 30;
}

function summurizeBothSections(pointsIndex) {
    score[activePlayer][14] += score[activePlayer][pointsIndex];
}

function checkTurnNumber() {
    turnNumber++;

    if (turnNumber === 13 * playersNumber)
        return true;
    else
        return false;
}

function prepareDataForNextTurn() {
    grid.fill(undefined);
    dicesToReroll.fill(true);
    dices.fill(undefined);
    rollNumber = 0;
}

function setNextPlayer() {
    if (activePlayer === playersNumber - 1)
        activePlayer = 0;
    else
        activePlayer++;
}

function endRound() {
    determineWinner();
    setMessage();
    const endgame = checkEndgame();

    if (endgame)
        return finalData = prepareFinalDataToReturn();
    else {
        prepareDataForNextRound();
        setNextPlayer();
        manageRoll();
        return endMatchData = prepareEndMatchDataToReturn();
    }
}

function determineWinner() {
    highestScore = score[0][14];
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
}

function setMessage() {
    if (!tie) {
        for (let i = 0; i < playersNumber; i++) {
            if (winners[i]) {
                victories[i] += 1;
                winnerMessage = `Rundę wygrał ${winners[i]} z wynikiem ${highestScore} punktów!`;
                break;
            }
        }
    }
    else {
        winnerMessage = `Remis pomiędzy`
        for (let i = 0; i < playersNumber; i++) {
            if (winners[i]) {
                victories[i] += 1;
                winnerMessage += ` ${winners[i]},`;
            }
        }
        winnerMessage += ` którzy zdobyli po ${highestScore} punktów!`;
    }
}

function checkEndgame() {
    let endgame = false;

    for (let i = 0; i < playersNumber; i++) {
        if (victories[i] === roundsNumber) {
            if (roundsNumber !== 1)
                winnerMessage = `Grę wygrał ${winners[i]}!`

            endgame = true;
            break;
        }
    }

    return endgame;
}

function prepareFinalDataToReturn() {
    const finalData = {};
    finalData.winnerMessage = winnerMessage;
    finalData.score = score;
    finalData.victories = victories;
    return finalData;
}

function prepareDataForNextRound() {
    grid.fill(undefined);
    dicesToReroll.fill(true);
    dices.fill(undefined);
    rollNumber = 0;

    turnNumber = 0;
    proposedPoints = Array(13).fill(null);

    for (let i = 0; i < playersNumber; i++)
        score[i] = Array(15).fill(null);
}

function prepareEndMatchDataToReturn() {
    const endMatchData = {}

    endMatchData.dices = dices;
    endMatchData.dicesPosition = dicesPosition;
    endMatchData.dicesRotation = dicesRotation;
    endMatchData.rollNumber = rollNumber;
    endMatchData.activePlayer = activePlayer;
    endMatchData.proposedPoints = proposedPoints;
    endMatchData.score = score;
    endMatchData.victories = victories;
    endMatchData.winnerMessage = winnerMessage;

    return endMatchData;
}

module.exports = {
    startNewGame,
    rerollDices,
    endTurn
};