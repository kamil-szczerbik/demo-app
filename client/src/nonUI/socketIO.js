//Zapakowanie socketa do zmiennej i wyeksportowanie go, �eby by� dost�pny od razu z dowolnego miejsca w aplikacji.
import openSocket from 'socket.io-client';
const socket = openSocket();
export default socket;