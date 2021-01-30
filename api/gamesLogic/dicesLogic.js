let dicesOfAKind = Array(6);
let upperSectionPoints = Array(6);
let lowerSectionPoints = Array(7);
let possiblePoints = Array(13);

let x3, x4, x32, smallStraight, largeStraight, general, chance; 
let x32Chance1, x32Chance2, smallStraightChance, largeStraightChance, oneOfAKind, twoOfAKind, oneAndTwoIterator;

function calculate(thrownDices) {
    setInitialValues();

    calculateDicesOfAKind(thrownDices);
    fillUpperSection();

    calculateChance();
    calculateXsAndGeneral();
    calculateStraights();

    fillLowerSection();

    possiblePoints = upperSectionPoints.concat(lowerSectionPoints);

    return possiblePoints;
}

function setInitialValues() {
    x3 = 0;
    x4 = 0;
    x32 = 0;
    smallStraight = 0;
    largeStraight = 0;
    general = 0;
    chance = 0;

    x32Chance1 = false;
    x32Chance2 = false;

    smallStraightChance = true;
    largeStraightChance = true;

    oneOfAKind = false;
    twoOfAKind = false;
    oneAndTwoIterator = 0;

    dicesOfAKind.fill(0);
}

function calculateDicesOfAKind(thrownDices) {
    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 6; j++)
            if (thrownDices[i] === j + 1)
                dicesOfAKind[j] += 1;
}

function fillUpperSection() {
    upperSectionPoints = dicesOfAKind.map((x, i) => {
        return (x * (i + 1));
    });
}

function calculateChance() {
    for (let i = 0; i < 6; i++)
        chance += upperSectionPoints[i];
}

function calculateXsAndGeneral() {
    for (let i = 0; i < 6; i++) {
        if (dicesOfAKind[i] === 2)
            x32Chance1 = true;
        else if (dicesOfAKind[i] > 2) {
            x3 = chance;
            x32Chance2 = true;
            smallStraightChance = false;

            if (dicesOfAKind[i] > 3) {
                x4 = x3;
                x32Chance2 = false;

                if (dicesOfAKind[i] === 5)
                    general = 50;
            }
        }
    }

    if (x32Chance1 && x32Chance2)
        x32 = 25;
}

function calculateStraights() {
    if (smallStraightChance) {
        for (let i = 0; i < 6; i++) {
            if (dicesOfAKind[i] === 1) {
                oneOfAKind = true;
                oneAndTwoIterator += 1;
            }
            else if (dicesOfAKind[i] === 2) {
                largeStraightChance = false;
                oneAndTwoIterator += 1;
                
                if (twoOfAKind === true)
                    smallStraightChance = false;

                twoOfAKind = true;
            }
            if ((oneOfAKind || twoOfAKind) && dicesOfAKind[i] === 0) {
                if (oneAndTwoIterator !== 5) {
                    largeStraightChance = false;
                    if (oneAndTwoIterator < 4)
                        smallStraightChance = false;
                }
            }
        }

        if (smallStraightChance) {
            smallStraight = 30;

            if (largeStraightChance)
                largeStraight = 40;
        }
    }
}

function fillLowerSection() {
    lowerSectionPoints[0] = x3;
    lowerSectionPoints[1] = x4;
    lowerSectionPoints[2] = x32;
    lowerSectionPoints[3] = smallStraight;
    lowerSectionPoints[4] = largeStraight;
    lowerSectionPoints[5] = general;
    lowerSectionPoints[6] = chance;
}

module.exports = calculate;