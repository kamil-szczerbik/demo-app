export async function logoutUser() {
    try {
        const response = await fetch('/api/logout', {
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