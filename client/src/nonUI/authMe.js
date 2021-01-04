//zmieniæ nazwê na authenticateUser i poprawiæ we wszystkich komponentach


//Funkcja wywo³uj¹ca sprawdzenie na serwerze czy u¿ytkownik jest zalogowany.
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
        console.log('Coœ posz³o nie tak: ' + err);
    }
}

//Funkcja zwracaj¹ca username z serwera.
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
        console.log('Coœ posz³o nie tak: ' + err);
    }
}