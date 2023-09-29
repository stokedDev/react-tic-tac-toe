import React from 'react';
import { useState } from 'react';
import { Fragment } from 'react';
function Square({value, onSquareClick}) {
  return ( 
  <button className="square" onClick={onSquareClick}>
    {value}
    </button> 
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext? "X": "O");
  }
  function squareMaker(){
    let boardRowsArr = [];
    for(let i = 0; i <= 8; i++){
        if(i % 3 === 0){
          boardRowsArr.push(
            <div className="board-row">
    <Square value = {squares[i]} onSquareClick={() => handleClick(i)} />
    <Square value = {squares[i+1]} onSquareClick={() => handleClick(i+1)} />
    <Square value = {squares[i+2]} onSquareClick={() => handleClick(i+2)} />
    </div>
          );
        }
    }
    return boardRowsArr;
  }
  return (
    <Fragment>
      <div className="status">{status}</div>
    {squareMaker()[0]}
    {squareMaker()[1]}
    {squareMaker()[2]}
  </Fragment>
  );
}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if(move === history.length - 1) {
      description = calculateWinner(currentSquares)? 
      calculateWinner(currentSquares) + ' is the winner.': 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { move === history.length - 1?<p>{description}</p>:
          <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
function calculateWinner(squares){
const lines = [
  [0,1,2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
for(let i = 0; i < lines.length; i++){
  const [a, b, c] = lines[i];
  if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
    return squares[a];
  }
}
return null;
};