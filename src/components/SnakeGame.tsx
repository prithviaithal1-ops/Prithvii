import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120; // ms per tick

export default function SnakeGame({ score, setScore }: { score?: number, setScore: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const appleRef = useRef<Point>({ x: 5, y: 5 });
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const requestRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  const spawnApple = useCallback((snakeBody: Point[]) => {
    let newApple: Point;
    let isColliding;
    do {
      newApple = {
        x: Math.floor(Math.random() * (canvasRef.current?.width || 400) / GRID_SIZE),
        y: Math.floor(Math.random() * (canvasRef.current?.height || 400) / GRID_SIZE),
      };
      isColliding = snakeBody.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    } while (isColliding);
    appleRef.current = newApple;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    scoreRef.current = 0;
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    setGameOver(false);
    setHasStarted(true);
    setIsPaused(false);
    spawnApple(INITIAL_SNAKE);
    lastUpdateRef.current = performance.now();
  }, [setScore, spawnApple]);

  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, glow: string) => {
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = glow;
    ctx.fillRect(x * GRID_SIZE + 1, y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.shadowBlur = 0; // Reset for performance on non-glowing elements if needed
  };

  const update = useCallback((time: number) => {
    if (gameOver || isPaused || !hasStarted) {
      if (!isPaused && hasStarted) {
        requestRef.current = requestAnimationFrame(update);
      }
      return;
    }

    if (time - lastUpdateRef.current < speedRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    lastUpdateRef.current = time;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cols = canvas.width / GRID_SIZE;
    const rows = canvas.height / GRID_SIZE;

    // Apply next direction
    directionRef.current = nextDirectionRef.current;
    const head = snakeRef.current[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y
    };

    // Check collisions (walls)
    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
      setGameOver(true);
      return;
    }

    // Check collisions (self)
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check apple
    if (newHead.x === appleRef.current.x && newHead.y === appleRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      // Speed up slightly
      speedRef.current = Math.max(50, speedRef.current - 2);
      spawnApple(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;

    // Draw
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid (optional, but looks cool for neon)
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
      ctx.lineWidth = 1;
      for(let i=0; i<=cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
      }
      for(let i=0; i<=rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
      }

      // Draw Apple
      drawSquare(ctx, appleRef.current.x, appleRef.current.y, '#FF0055', '#FF0055');

      // Draw Snake
      snakeRef.current.forEach((segment, index) => {
        const color = index === 0 ? '#00FF00' : '#00AA00';
        const glow = index === 0 ? '#00FF00' : 'transparent';
        drawSquare(ctx, segment.x, segment.y, color, glow);
      });
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameOver, isPaused, hasStarted, setScore, spawnApple]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        if (isPaused) {
           lastUpdateRef.current = performance.now();
           requestRef.current = requestAnimationFrame(update);
        }
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver, isPaused, update]);

  useEffect(() => {
    if (hasStarted && !isPaused && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hasStarted, isPaused, gameOver, update]);

  // Initial render empty canvas
  useEffect(() => {
    if (!hasStarted) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [hasStarted]);

  return (
    <div className="relative group w-full flex justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full h-auto bg-[#0a0a0a] rounded-lg cursor-crosshair focus:outline-none"
        tabIndex={0}
      />
      
      {(!hasStarted || gameOver) && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in z-10 transition-all duration-300">
          <h2 className="text-3xl font-black italic text-[#00FF00] mb-2 uppercase drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
            {gameOver ? 'SYSTEM FAILURE' : 'SYSTEM READY'}
          </h2>
          {gameOver && (
            <p className="text-[#00AA00] mb-6 font-mono">Final Score: {scoreRef.current}</p>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-8 py-3 bg-[#00FF00]/10 border border-[#00FF00] hover:bg-[#00FF00] text-[#00FF00] hover:text-black font-bold uppercase tracking-widest rounded transition-all duration-200 shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)]"
          >
            {gameOver ? <RotateCcw size={18} /> : <Play size={18} />}
            {gameOver ? 'Reboot' : 'Initialize'}
          </button>
        </div>
      )}

      {isPaused && !gameOver && hasStarted && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
          <h2 className="text-2xl font-black text-[#00FF00] uppercase tracking-[0.2em] animate-pulse">
            PAUSED
          </h2>
        </div>
      )}
    </div>
  );
}
