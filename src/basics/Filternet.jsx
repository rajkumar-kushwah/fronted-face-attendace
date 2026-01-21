import React, { useState, useEffect } from "react";

const GRID_SIZE = 15; // 15x15 grid
const CELL_SIZE = 20; // 20px per cell

function SnakeGame() {
  const [snake, setSnake] = useState([[7, 7]]); // initial position
  const [food, setFood] = useState([3, 3]);
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Arrow key control
  const handleKey = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  // Snake movement
  useEffect(() => {
    if (gameOver) return;

    const move = () => {
      let newSnake = [...snake];
      let head = [...newSnake[newSnake.length - 1]];

      switch (direction) {
        case "UP":
          head[0] -= 1;
          break;
        case "DOWN":
          head[0] += 1;
          break;
        case "LEFT":
          head[1] -= 1;
          break;
        case "RIGHT":
          head[1] += 1;
          break;
        default:
          break;
      }

      // Check collision: wall
      if (
        head[0] < 0 ||
        head[0] >= GRID_SIZE ||
        head[1] < 0 ||
        head[1] >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check collision: self
      if (newSnake.some(([x, y]) => x === head[0] && y === head[1])) {
        setGameOver(true);
        return;
      }

      newSnake.push(head);

      // Check food
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(score + 1);
        // generate new food
        let newFood;
        do {
          newFood = [
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE),
          ];
        } while (newSnake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
        setFood(newFood);
      } else {
        newSnake.shift(); // remove tail if no food
      }

      setSnake(newSnake);
    };

    const interval = setInterval(move, 200);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, score]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      {gameOver && <h2 style={{ color: "red" }}>Game Over!</h2>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          margin: "0 auto",
          border: "2px solid black",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = Math.floor(idx / GRID_SIZE);
          const y = idx % GRID_SIZE;
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={idx}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                border: "1px solid #ddd",
                backgroundColor: isSnake ? "green" : isFood ? "red" : "white",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SnakeGame;

