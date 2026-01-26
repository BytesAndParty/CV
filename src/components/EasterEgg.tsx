import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Gamepad2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EasterEggProps {
  children: React.ReactNode;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type Particle = { id: number; x: number; y: number; color: string };

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 120;

export default function EasterEgg({ children }: EasterEggProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Snake game state
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>('RIGHT');
  const particleIdRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Toast helper
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Handle logo click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 1) {
      showToastMessage('9 more clicks to unlock a secret...');
    } else if (newCount >= 2 && newCount < 10) {
      showToastMessage(`${10 - newCount} more...`);
    } else if (newCount === 10) {
      showToastMessage('Snake unlocked!');
      setTimeout(() => {
        setShowGame(true);
        startGame();
      }, 1000);
      setClickCount(0);
    }
  };

  // Spawn particles
  const spawnParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const colors = ['rgb(var(--theme-primary))', 'rgb(var(--theme-accent))', '#fff'];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Start countdown then game
  const startCountdown = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setParticles([]);
    setCountdown(5);
  }, [generateFood]);

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 800);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, start game
      const timer = setTimeout(() => {
        setCountdown(null);
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Alias for backwards compatibility
  const startGame = startCountdown;

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const currentDirection = directionRef.current;

        switch (currentDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          spawnParticles(food.x, food.y);
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, food, generateFood, highScore]);

  // Keyboard controls
  useEffect(() => {
    if (!showGame) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
        case 'Escape':
          closeGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGame]);

  const closeGame = () => {
    setShowGame(false);
    setIsPlaying(false);
    setGameOver(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  // Shared direction change function
  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    if (
      (newDir === 'UP' && currentDir !== 'DOWN') ||
      (newDir === 'DOWN' && currentDir !== 'UP') ||
      (newDir === 'LEFT' && currentDir !== 'RIGHT') ||
      (newDir === 'RIGHT' && currentDir !== 'LEFT')
    ) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipe) changeDirection('RIGHT');
      else if (deltaX < -minSwipe) changeDirection('LEFT');
    } else {
      if (deltaY > minSwipe) changeDirection('DOWN');
      else if (deltaY < -minSwipe) changeDirection('UP');
    }

    touchStartRef.current = null;
  }, [changeDirection]);

  return (
    <>
      {/* Clickable wrapper */}
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="relative px-5 py-3 rounded-xl text-sm font-medium text-foreground
                          bg-card/80 backdrop-blur-xl border border-primary/20
                          shadow-[0_0_30px_rgb(var(--theme-primary)/0.2),0_10px_40px_-10px_rgb(0_0_0/0.3)]">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-xl -z-10" />
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 -z-10">
                <div className="w-full h-full rounded-xl bg-card/90" />
              </div>
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-primary" />
                {toastMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Modal */}
      <AnimatePresence>
        {showGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen w-screen"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeGame()}
          >
            {/* Backdrop with blur and gradient */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10"
            >
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />

              {/* Main card */}
              <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl p-6
                            border border-primary/20 shadow-2xl
                            shadow-[0_0_60px_rgb(var(--theme-primary)/0.15)]">
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[spin_4s_linear_infinite] blur-sm opacity-50"
                       style={{ backgroundSize: '200% 200%' }} />
                </div>
                <div className="absolute inset-[1px] rounded-2xl bg-card/95" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl">🐍</span>
                      <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        Snake
                      </span>
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeGame}
                      className="hover:bg-primary/10 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Score Display */}
                  <div className="flex justify-between items-center mb-5 px-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
                      <motion.span
                        key={score}
                        initial={{ scale: 1.5, color: 'rgb(var(--theme-primary))' }}
                        animate={{ scale: 1, color: 'inherit' }}
                        className="text-2xl font-bold text-foreground"
                      >
                        {score}
                      </motion.span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-500" /> Best
                      </span>
                      <span className="text-2xl font-bold text-yellow-500">{highScore}</span>
                    </div>
                  </div>

                  {/* Game Board */}
                  <div
                    className="relative rounded-xl overflow-hidden touch-none"
                    style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Board background with grid */}
                    <div className="absolute inset-0 bg-secondary/30" />
                    <div className="absolute inset-0 opacity-20"
                         style={{
                           backgroundImage: `
                             linear-gradient(to right, rgb(var(--theme-primary) / 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgb(var(--theme-primary) / 0.1) 1px, transparent 1px)
                           `,
                           backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                         }} />

                    {/* Inner glow */}
                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgb(var(--theme-primary)/0.1)]" />

                    {/* Snake */}
                    {snake.map((segment, index) => {
                      const isHead = index === 0;
                      const opacity = 1 - (index * 0.03);
                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute"
                          style={{
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            left: segment.x * CELL_SIZE + 1,
                            top: segment.y * CELL_SIZE + 1,
                          }}
                        >
                          {/* Segment glow */}
                          {isHead && (
                            <div className="absolute inset-0 bg-primary rounded-md blur-md opacity-60" />
                          )}
                          {/* Segment body */}
                          <div
                            className={`absolute inset-0 rounded-md ${isHead ? 'bg-gradient-to-br from-primary to-accent' : 'bg-primary'}`}
                            style={{ opacity }}
                          />
                          {/* Segment shine */}
                          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-white/30 to-transparent"
                               style={{ height: '50%' }} />
                        </motion.div>
                      );
                    })}

                    {/* Food */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        scale: { duration: 0.8, repeat: Infinity },
                        rotate: { duration: 0.5, repeat: Infinity }
                      }}
                      className="absolute"
                      style={{
                        width: CELL_SIZE - 2,
                        height: CELL_SIZE - 2,
                        left: food.x * CELL_SIZE + 1,
                        top: food.y * CELL_SIZE + 1,
                      }}
                    >
                      {/* Food glow */}
                      <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-70" />
                      {/* Food body */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-full" />
                      {/* Food shine */}
                      <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full"
                           style={{ height: '40%' }} />
                    </motion.div>

                    {/* Particles */}
                    <AnimatePresence>
                      {particles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 1,
                            opacity: 1
                          }}
                          animate={{
                            x: particle.x + (Math.random() - 0.5) * 60,
                            y: particle.y + (Math.random() - 0.5) * 60,
                            scale: 0,
                            opacity: 0
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="absolute w-2 h-2 rounded-full pointer-events-none"
                          style={{
                            backgroundColor: particle.color,
                            boxShadow: `0 0 10px ${particle.color}`
                          }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Countdown Overlay */}
                    <AnimatePresence>
                      {countdown !== null && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20"
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={countdown}
                              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                              exit={{ scale: 1.5, opacity: 0, rotateY: 90 }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="relative"
                            >
                              {countdown > 0 ? (
                                <>
                                  {/* Glow */}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
                                  </div>
                                  {/* Number */}
                                  <span className="relative text-8xl font-black bg-linear-to-br from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl">
                                    {countdown}
                                  </span>
                                </>
                              ) : (
                                <>
                                  {/* Glow */}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-40 h-20 bg-accent/40 rounded-full blur-2xl" />
                                  </div>
                                  {/* GO! */}
                                  <span className="relative text-6xl font-black bg-linear-to-r from-accent via-primary to-accent bg-clip-text text-transparent drop-shadow-2xl">
                                    GO!
                                  </span>
                                </>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Game Over Overlay */}
                    <AnimatePresence>
                      {gameOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
                        >
                          <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="text-center"
                          >
                            <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                              Game Over!
                            </p>
                            <p className="text-muted-foreground mb-1">Score: <span className="text-primary font-bold">{score}</span></p>
                            {score >= highScore && score > 0 && (
                              <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-yellow-500 text-sm font-medium mb-4 flex items-center justify-center gap-1"
                              >
                                <Trophy className="w-4 h-4" /> New High Score!
                              </motion.p>
                            )}
                            <Button
                              onClick={startGame}
                              className="mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0"
                            >
                              Play Again
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Desktop Controls hint */}
                  <p className="hidden sm:flex text-xs text-muted-foreground text-center mt-5 items-center justify-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">↑↓←→</kbd>
                    <span>or</span>
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">WASD</kbd>
                    <span className="mx-1">•</span>
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">ESC</kbd>
                    <span>to close</span>
                  </p>

                  {/* Mobile D-Pad Controls */}
                  <div className="sm:hidden mt-5">
                    <p className="text-xs text-muted-foreground text-center mb-3">Swipe or use buttons</p>
                    <div className="flex flex-col items-center gap-1">
                      {/* Up */}
                      <button
                        onClick={() => changeDirection('UP')}
                        className="w-12 h-12 rounded-xl bg-secondary/50 border border-primary/20 flex items-center justify-center
                                   active:bg-primary/20 active:scale-95 transition-all touch-none"
                      >
                        <ChevronUp className="w-6 h-6 text-primary" />
                      </button>
                      {/* Left, Down, Right */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => changeDirection('LEFT')}
                          className="w-12 h-12 rounded-xl bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>
                        <button
                          onClick={() => changeDirection('DOWN')}
                          className="w-12 h-12 rounded-xl bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronDown className="w-6 h-6 text-primary" />
                        </button>
                        <button
                          onClick={() => changeDirection('RIGHT')}
                          className="w-12 h-12 rounded-xl bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
