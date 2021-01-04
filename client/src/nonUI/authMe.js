//zmieni� nazw� na authenticateUser i poprawi� we wszystkich komponentach


//Funkcja wywo�uj�ca sprawdzenie na serwerze czy u�ytkownik jest zalogowany.
export async function authMe() {
    try {
        const response = await fetch('/api/authenticate', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        });

        return response;
    }
    catch (err) {
        console.log('Co� posz�o nie tak: ' + err);
    }
}

//Funkcja zwracaj�ca username z serwera.
export async function getUsername() {
    try {
        const response = await fetch('/api/getUsername', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        });

        return response;
    }
    catch(err) {
        console.log('Co� posz�o nie tak: ' + err);
    }
}