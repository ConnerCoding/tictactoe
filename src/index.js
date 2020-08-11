import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Place X or O in square when clicked
const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );

}

class Board extends React.Component {
    // Draw individual square
    renderSquare(i) {
        return (
          <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />

        );
    }

    // Draw all squares
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

function calculateWinner(squares) {
    // array of all the win conditions
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
      // if all 3 squares of array equal, it is a win
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    // return null, no winner
    return null;
  }

class Game extends React.Component {
    // Create history and stepNumber to keep track of previous moves
    state = {
        history: [{
            squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0
    }

    handleClick(i) {
        // Create copy of the current history array
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        
        // Get the most current history of moves object
        const current = history[history.length-1];
        
        // Create copy of current squares array
        const squares = current.squares.slice();
        
        // If game is won or square is filled return
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // Update state with the new square value added
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9){
            status = 'Tie!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
                <div>{status}</div>
                <Board 
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <ul>{moves}</ul>
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
  