import React, { Component } from 'react';
import Header from '../Header';
import NewBoard from './NewBoard';
import Board from './Board';
import Footer from '../Footer';
import Alert from '../alerts/Alert';
import boardStyle from '../../css/board.module.css';
import socket from '../../nonUI/socketIO';

class BoardsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardsList: [],
            alertMessage: ''
        };
    }

    componentDidMount() {
        this.initializeSockets();
        this.tryGetBoardsList();
    }

    initializeSockets() {
        socket.on('updateBoardsList', (updatedBoardsList) => {
            this.loadBoardsList(updatedBoardsList);
        });

        socket.on('updateBoard', (updatedBoard) => {
            this.setState({
                boardsList: this.state.boardsList.map(item => {
                    if (item.props.id === updatedBoard.id) {
                        return {
                            ...item,
                            props: { key: updatedBoard.id.toString(), id: updatedBoard.id, started: updatedBoard.started, leader: updatedBoard.leader, type: updatedBoard.type, password: updatedBoard.password }
                        };
                    }
                    return item;
                })
            });
        });
    }

    tryGetBoardsList() {
        try {
            this.getBoardsList();
        }
        catch (err) {
            this.showAlert('Coś poszło nie tak: ' + err);
        }
    }

    async getBoardsList() {
        const boardsListResponse = await fetch('/api/boardsList', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (boardsListResponse.status === 200) {
            const boardsListResponseJSON = await boardsListResponse.json();
            this.loadBoardsList(boardsListResponseJSON);
        } 
        else
            this.showAlert('Coś poszło nie tak. Spróbuj ponownie.');
    }

    loadBoardsList(boardsList) {
        const newBoardsList = boardsList.filter(check => {
            if (check)
                return true;
            else
                return false;
        }).map(board => (
            <Board key={board.id.toString()} id={board.id} started={board.started} leader={board.leader} type={board.type} password={board.password} />
        ));

        this.setState({ boardsList: newBoardsList })
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    componentWillUnmount() {
        socket.off('updateBoardsList');
        socket.off('updateBoard');
    }

    render() {
        return (
            <>
                <Header />
                <div className={boardStyle.container}>
                    <NewBoard />
                    {this.state.boardsList}
                </div>
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
                <Footer />
            </>
        );
    }
}

export default BoardsList;