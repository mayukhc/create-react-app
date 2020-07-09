import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
        return (
            <button className="square"
                    onClick={props.onClick}>
                {props.value}
            </button>
        );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
            value={this.props.squareValues[i]}
            onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameHistory : [{
                sqVls : Array(9).fill(null),
            }],
            xIsNext : true,
            stepNumber: 0,
        }
    }

    jumpTo(stepNum){
        this.setState({
            stepNumber: stepNum,
            xIsNext: (stepNum%2) === 0,
        }
    );
    }

    handleClick(input){
        const history = this.state.gameHistory.slice(0, this.state.stepNumber+1);
        const currentBoard = history[history.length-1];
        const newSquaresValues = currentBoard.sqVls.slice();
        if (calculateWinner(newSquaresValues) || newSquaresValues[input]){
            return;
        }
        newSquaresValues[input] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            gameHistory : history.concat([{sqVls: newSquaresValues}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,})
    }

    render() {
        const history = this.state.gameHistory;
        const currentBoard = history[this.state.stepNumber];
        const winner = calculateWinner(currentBoard.sqVls);

        const pastMoves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (<li key ={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>);
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squareValues={currentBoard.sqVls}
                        onClick= {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{pastMoves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

