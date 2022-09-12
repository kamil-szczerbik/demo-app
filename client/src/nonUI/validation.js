function checkUsername(username) {
    if (username === '')
        return 'Nie podano nazwy użytkownika';
    else if (username.length < 4 || username.length > 14)
        return 'Nazwa użytkownika musi mieć od 4 do 14 znaków';

    return '';
}

//Ciekawy wątek o walidacji maili https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkEmail(email) {
    if (email === '')
        return 'Nie podano adresu email';
    else if (email.indexOf('@') < 1 || email.indexOf('.') < 1)
        return 'To nie jest adres email';

    return '';
}

function checkPassword(password) {
    if (password === '')
        return 'Nie podano hasła';
    else if (password.length < 8 || password.length > 30)
        return 'Hasło musi się składać z przynajmniej 8 znaków';
    else if (!password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/))
        return 'Hasło musi zawierać małą i wielką literę oraz cyfrę';

    return '';
}

function checkPasswordConfirmation(password, passwordConfirmation) {
    if (passwordConfirmation === '')
        return 'Potwierdź hasło';
    else if (passwordConfirmation !== password)
        return 'Podane hasła nie są takie same';

    return '';
}

function checkName(name) {
    if (!name)
        return ''
    else if (name.length === 1 || name.length > 35)
        return 'Imię musi mieć od 2 do 35 znaków';

    return '';
}

function checkAboutme(aboutme) {
    if (!aboutme)
        return '';
    else if (aboutme.length > 255)
        return 'Opis może mieć maksymalnie 255 znaków';

    return '';
}

export {
    checkUsername,
    checkEmail,
    checkPassword,
    checkPasswordConfirmation,
    checkName,
    checkAboutme
};