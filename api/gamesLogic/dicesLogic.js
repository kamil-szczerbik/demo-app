let dots = []; //6 mo¿liwych wartoœci - ile razy powtarza siê dana wartoœæ
let firstPartValues = []; //wartoœæ danych oczek do tabelki
let secondPartValues = []; //x3 x4 x32 mStrit dStrut gen chance
let proposedValues = [];

//Obliczanie wszystkich wartoœci
function calculate(dices) {
    let x3 = 0, x4 = 0, x32 = 0, mStrit = 0, dStrit = 0, gen = 0, chance = 0;

    let chance1 = false, chance2 = false; //chance1 dla 2, chance2 dla 3 powtórzeñ
    let chanceMS = true, chanceDS = true; //szanse dla ma³ego i du¿ego strita
    let was1 = false, was2 = false;
    let pom = 0;

    //Pocz¹tkowa to 0 w tabelce
    for (let i = 0; i < 6; i++) {
        dots[i] = 0;
    }

    //Ile razy dana wartoœæ siê powtarza w rzucie
    for (let i = 0; i < 5; i++) {
        for (let j = 1; j < 7; j++) {
            if (dices[i] === j) {
                dots[j - 1] += 1;
            }
        }
    }

    //Wyliczenie sumy danego oczka
    firstPartValues = dots.map(function (x, i) {
        return (x * (i + 1));
    });

    //Suma wszystkich oczek
    for (let i = 1; i < 7; i++) {
        chance += dots[i - 1] * i;
    }

    //Wyliczenie 3x, 4x, genera³a i sprawdzenie szansy na 3+2
    for (let i = 0; i < 6; i++) {

        if (dots[i] === 2) {
            chance1 = true;
        }
        if (dots[i] > 2) {
            x3 = chance;
            chance2 = true;
            chanceMS = false;
            if (dots[i] > 3) {
                x4 = x3;
                chance2 = false;
                if (dots[i] === 5)
                    gen = 50;
            }
        }
    }

    //Sprawdzenie czy jest 3+2
    if (chance1 && chance2)
        x32 = 25;

    //Sprawdzenie Ma³ego Strita i Du¿ego Strita
    if (chanceMS === true) {
        for (let i = 0; i < 6; i++) {
            /*console.log(`dots[${i + 1}] = ${dots[i]}`);*/
            if (dots[i] === 1) {
                was1 = true;
                pom += 1;
                /*console.log(`${i + 1}. 1`);*/
            }
            else if (dots[i] === 2) {
                if (was2 === true) {
                    chanceMS = false;
                    /*console.log(`${i + 1}. 2 - Nie ma juz szans!`);*/
                }
                was2 = true;
                pom += 1;
                chanceDS = false;
                /*console.log(`${i + 1}. 2`);*/
            }
            if ((was1 || was2) && dots[i] === 0) {
                /*console.log(`${i + 1}. 2 - Brak takiej wartosci`);*/
                if (pom !== 5) {
                    chanceDS = false;
                    if (pom < 4) {
                        /*console.log(`${i + 1}. 0 - Przerwany ciag`);*/
                        chanceMS = false;
                    }
                }
            }
        }
        if (chanceMS === true) {
            mStrit = 30;
            /*console.log("Maly Strit~!");*/

            if (chanceDS === true) {
                dStrit = 40;
                /*console.log("Duzy Strit~!");*/
            }
        }
    }

    secondPartValues[0] = x3;
    secondPartValues[1] = x4;
    secondPartValues[2] = x32;
    secondPartValues[3] = mStrit;
    secondPartValues[4] = dStrit;
    secondPartValues[5] = gen;
    secondPartValues[6] = chance;

    proposedValues = firstPartValues.concat(secondPartValues);
    return proposedValues;
}

module.exports = calculate;