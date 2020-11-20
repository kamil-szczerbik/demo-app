import React, { Component } from 'react';
import NewBoard from './NewBoard';
import Board from './Board';
import boardStyle from '../../css/board.module.css';
import socket from '../../nonUI/socketIO';

class BoardsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardsList: []
        };
    }

    loadList(res) {
        const newBoardsList = res.filter(check => {
            if (check)
                return true;
            else
                return false;
        }).map(board => (
            <Board key={board.id.toString()} id={board.id} started={board.started} creator={board.creator} type={board.type} password={board.password}/>
        ));

        this.setState({boardsList: newBoardsList})
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/boardsList', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const responseJSON = await response.json();
            await this.loadList(responseJSON);
        }
        catch (err) {
            console.log(err);
        }

        socket.on('updateBoardsList', (boards) => {
            this.loadList(boards);
        });

        socket.on('updateBoard', (board) => {
            this.setState({
                boardsList: this.state.boardsList.map(item => {
                    if (item.props.id === board.id) {
                        return {
                            ...item,
                            props: { key: board.id.toString(), id: board.id, started: board.started, creator: board.creator, type: board.type, password: board.password }
                        };
                    }
                    return item;
                })
            });
        });
    }

    componentWillUnmount() {
        socket.off('updateBoardsList');
    }

    render() {
        return (
            
                <div className={boardStyle.boardContainer}>
                    <NewBoard />
                    {
                        this.state.boardsList
                    }
                </div>
            
        );
    }
}

export default BoardsList;