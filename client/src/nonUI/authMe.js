export async function authMe() {
    const ob = {};
    const response = await fetch('/api/authenticate', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    });

    ob.status = response.status;

    if (ob.status === 200) {
        const json = await response.json();
        ob.username = json.username;
    }
    return ob;
}
//catch???