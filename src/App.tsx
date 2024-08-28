import { useState } from "react";
import "./style.css";

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  highlight: boolean;
}

function Square({ value, onSquareClick, highlight }: SquareProps) {
  return (
    <button
      id="square"
      onClick={onSquareClick}
      style={{ backgroundColor: highlight ? "black" : "" }}
    >
      {value}
    </button>
  );
}

interface WinnerResult {
  winner: string;
  line: number[];
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [status, setStatus] = useState<JSX.Element>(
    <>
      <span>X O </span>Game
    </>
  );
  const [winningSquares, setWinningSquares] = useState<number[]>([]);

  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) return;

    const newSquares = [...squares];
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newSquares);
    if (result) {
      setStatus(
        <>
          <span>{result.winner}</span> Wins
        </>
      );
      setWinningSquares(result.line);
    } else if (newSquares.every((square) => square !== null)) {
      setStatus(
        <>
          <span>Equal</span> Game
        </>
      );
    } else {
      setStatus(
        <>
          Next player is <span>{xIsNext ? "O" : "X"}</span>
        </>
      );
    }
  }

  const handleReset = () => {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
    setStatus(
      <>
        <span>X O </span>Game
      </>
    );
    setWinningSquares([]);
  };

  const renderSquare = (i: number) => (
    <Square
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      highlight={winningSquares.includes(i)}
    />
  );

  return (
    <section>
      <h1 className="status">{status}</h1>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button id="Restart" onClick={handleReset}>
        <span>Restart</span>
      </button>
    </section>
  );
}

function calculateWinner(squares: (string | null)[]): WinnerResult | null {
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
      return { winner: squares[a] || "", line: lines[i] };
    }
  }
  return null;
}
