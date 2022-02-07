//Inicjuje app.js, a póŸniej odpala serwer.

const http = require('./app');

/*app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${server.address().port}`);
});*/

const server = http.listen(process.env.PORT || 4000, () => {
    console.log(`Listening on ${server.address().port}`);
});