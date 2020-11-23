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
        console.log('dupa');
        console.log(err);
    }
}

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
        console.log(err);
    }
}