import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'motion/react';
import { X, Trophy, Gamepad2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Translations } from '../i18n/utils';

interface EasterEggProps {
  children: React.ReactNode;
  translations: Translations;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type Particle = { id: number; x: number; y: number; dx: number; dy: number; color: string };
type PowerUpType = 'speed_down' | 'speed_up' | 'bonus';
type PowerUp = { position: Position; type: PowerUpType };
type ActiveEffect = { type: 'speed_down' | 'speed_up'; remaining: number };

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 120;
const SLOW_START_SPEED = 280; // very slow tick for first few seconds
const SLOW_START_DURATION = 5000; // 5 seconds grace period
const MIN_SPEED = 55; // fastest possible tick
const SPEED_DECREASE_PER_FOOD = 2; // ms faster per food eaten
const POWER_UP_SPAWN_INTERVAL = 8000; // ms between spawn attempts
const POWER_UP_LIFETIME = 6000; // ms before power-up disappears
const SPEED_EFFECT_DURATION = 10; // seconds

const POWER_UP_TYPES: PowerUpType[] = ['speed_down', 'speed_up', 'bonus'];

// Complementary hue mapping per color scheme
const COMPLEMENTARY_COLORS: Record<string, string> = {
  green: '345',   // ~pink/rose (complement of emerald ~165)
  orange: '220',  // ~blue (complement of orange ~40)
  purple: '95',   // ~yellow-green (complement of violet ~275)
  red: '175',     // ~teal/cyan (complement of red ~355)
  blue: '55',     // ~yellow (complement of blue ~235)
};

export default function EasterEgg({ children, translations: t }: EasterEggProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Snake game state (direction lives in refs only - it must not re-render the board)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directionRef = useRef<Direction>('RIGHT');
  const directionQueueRef = useRef<Direction[]>([]);
  const particleIdRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Power-up state
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [activeEffect, setActiveEffect] = useState<ActiveEffect | null>(null);
  const [powerUpMessage, setPowerUpMessage] = useState<string | null>(null);
  const powerUpSpawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const powerUpLifetimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const effectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progressive speed state
  const gameStartTimeRef = useRef<number>(0);
  const foodEatenRef = useRef<number>(0);
  const effectMultiplierRef = useRef<number>(1);

  // Responsive cell size for mobile
  const [cellSize, setCellSize] = useState(CELL_SIZE);
  const cellSizeRef = useRef(CELL_SIZE);

  useEffect(() => {
    const updateCellSize = () => {
      // Available width = screen - 2*16px margin - 2*12px card padding
      const availableWidth = window.innerWidth - 56;
      const newSize = Math.min(CELL_SIZE, Math.floor(availableWidth / GRID_SIZE));
      setCellSize(newSize);
      cellSizeRef.current = newSize;
    };
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  // Calculate current tick speed based on elapsed time, food eaten, and power-up effects
  const calculateSpeed = (): number => {
    const elapsed = Date.now() - gameStartTimeRef.current;
    // Base speed gets faster with each food eaten
    const baseSpeed = Math.max(INITIAL_SPEED - foodEatenRef.current * SPEED_DECREASE_PER_FOOD, MIN_SPEED);

    let speed: number;
    if (elapsed < SLOW_START_DURATION) {
      // Lerp from slow start speed to base speed over the grace period
      const progress = elapsed / SLOW_START_DURATION;
      speed = SLOW_START_SPEED + (baseSpeed - SLOW_START_SPEED) * progress;
    } else {
      speed = baseSpeed;
    }

    // Apply power-up multiplier
    speed = Math.round(speed * effectMultiplierRef.current);
    return Math.max(speed, MIN_SPEED);
  };

  // Load high score
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('snakeHighScore') ?? '', 10);
    if (!Number.isNaN(saved)) setHighScore(saved);
  }, []);

  // Toast helper
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    // Clear a pending timer so a rapid follow-up toast is not dismissed early
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2500);
  };

  // Handle logo click
  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 1) {
      showToastMessage(t.easterEgg.clicksRemaining.replace('{n}', '9'));
    } else if (newCount >= 2 && newCount < 10) {
      showToastMessage(t.easterEgg.moreClicks.replace('{n}', String(10 - newCount)));
    } else if (newCount === 10) {
      showToastMessage(t.easterEgg.unlocked);
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
        x: x * cellSizeRef.current + cellSizeRef.current / 2,
        y: y * cellSizeRef.current + cellSizeRef.current / 2,
        // Random scatter target precomputed here - render must stay pure
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 60,
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

  // Generate random power-up position (avoiding snake and food)
  const generatePowerUpPosition = useCallback((currentSnake: Position[], currentFood: Position): Position => {
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(s => s.x === pos.x && s.y === pos.y) ||
      (currentFood.x === pos.x && currentFood.y === pos.y)
    );
    return pos;
  }, []);

  // Get complementary color for power-up
  const getComplementaryColor = useCallback((): string => {
    const scheme = document.documentElement.getAttribute('data-color-scheme') || 'green';
    const hue = COMPLEMENTARY_COLORS[scheme] || '345';
    return `oklch(0.7 0.2 ${hue})`;
  }, []);

  // Clear all power-up timers
  const clearPowerUpTimers = useCallback(() => {
    if (powerUpSpawnRef.current) clearTimeout(powerUpSpawnRef.current);
    if (powerUpLifetimeRef.current) clearTimeout(powerUpLifetimeRef.current);
    if (effectTimerRef.current) clearInterval(effectTimerRef.current);
  }, []);

  // Start countdown then game
  const startCountdown = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    directionRef.current = 'RIGHT';
    directionQueueRef.current = [];
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setParticles([]);
    setCountdown(5);
    // Reset power-up state
    setPowerUp(null);
    setActiveEffect(null);
    setPowerUpMessage(null);
    clearPowerUpTimers();
    // Reset progressive speed state
    foodEatenRef.current = 0;
    effectMultiplierRef.current = 1;
    gameStartTimeRef.current = 0;
  }, [generateFood, clearPowerUpTimers]);

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
        gameStartTimeRef.current = Date.now();
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Alias for backwards compatibility
  const startGame = startCountdown;

  // Apply speed effect
  const applySpeedEffect = useCallback((type: 'speed_down' | 'speed_up') => {
    // Clear any existing effect timer
    if (effectTimerRef.current) clearInterval(effectTimerRef.current);

    effectMultiplierRef.current = type === 'speed_down' ? 1.25 : 0.75;
    setActiveEffect({ type, remaining: SPEED_EFFECT_DURATION });

    // Countdown the effect timer — speed resets automatically when it expires
    effectTimerRef.current = setInterval(() => {
      setActiveEffect(prev => {
        if (!prev || prev.remaining <= 1) {
          effectMultiplierRef.current = 1;
          if (effectTimerRef.current) clearInterval(effectTimerRef.current);
          return null;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  }, []);

  // Show power-up pickup message
  const powerUpMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showPowerUpMessage = useCallback((msg: string) => {
    setPowerUpMessage(msg);
    if (powerUpMessageTimerRef.current) clearTimeout(powerUpMessageTimerRef.current);
    powerUpMessageTimerRef.current = setTimeout(() => setPowerUpMessage(null), 1500);
  }, []);

  // Clear message timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (powerUpMessageTimerRef.current) clearTimeout(powerUpMessageTimerRef.current);
    };
  }, []);

  // Move focus into the dialog when it opens (screen reader / keyboard users)
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showGame) modalRef.current?.focus();
  }, [showGame]);

  // Mirror latest state into refs so spawn timers can read it directly
  // (state updaters must stay pure - no side effects inside them)
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const powerUpRef = useRef(powerUp);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { powerUpRef.current = powerUp; }, [powerUp]);

  // Spawn power-up periodically - a single timer chain, so there is always
  // at most one pending spawn timer (the old nested-updater version rescheduled
  // twice when the field was occupied, growing timer chains exponentially)
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const trySpawn = () => {
      // Only spawn if no power-up currently on field
      if (!powerUpRef.current) {
        const pos = generatePowerUpPosition(snakeRef.current, foodRef.current);
        const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
        setPowerUp({ position: pos, type });

        // Auto-remove after lifetime
        powerUpLifetimeRef.current = setTimeout(() => {
          setPowerUp(null);
        }, POWER_UP_LIFETIME);
      }
      powerUpSpawnRef.current = setTimeout(trySpawn, POWER_UP_SPAWN_INTERVAL);
    };

    powerUpSpawnRef.current = setTimeout(trySpawn, POWER_UP_SPAWN_INTERVAL);

    return () => {
      if (powerUpSpawnRef.current) clearTimeout(powerUpSpawnRef.current);
      if (powerUpLifetimeRef.current) clearTimeout(powerUpLifetimeRef.current);
    };
  }, [isPlaying, gameOver, generatePowerUpPosition]);

  // Game loop with dynamic speed
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        // Consume next direction from queue (safe against 180° reversals)
        if (directionQueueRef.current.length > 0) {
          directionRef.current = directionQueueRef.current.shift()!;
        }
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
          foodEatenRef.current++;
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

        // Check power-up collision
        setPowerUp(currentPowerUp => {
          if (currentPowerUp && head.x === currentPowerUp.position.x && head.y === currentPowerUp.position.y) {
            spawnParticles(head.x, head.y);
            if (powerUpLifetimeRef.current) clearTimeout(powerUpLifetimeRef.current);

            switch (currentPowerUp.type) {
              case 'speed_down':
                applySpeedEffect('speed_down');
                showPowerUpMessage(t.easterEgg.powerUp.speedDown);
                break;
              case 'speed_up':
                applySpeedEffect('speed_up');
                showPowerUpMessage(t.easterEgg.powerUp.speedUp);
                break;
              case 'bonus':
                setScore(prev => {
                  const newScore = prev + 50;
                  if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem('snakeHighScore', newScore.toString());
                  }
                  return newScore;
                });
                // Grow snake by 5 segments (duplicate tail)
                setSnake(s => {
                  const tail = s[s.length - 1];
                  return [...s, ...Array(5).fill(tail)];
                });
                showPowerUpMessage(t.easterEgg.powerUp.bonus);
                break;
            }
            return null; // Remove power-up
          }
          return currentPowerUp;
        });

        return newSnake;
      });

      // Re-schedule with dynamic speed (gets faster over time and with score)
      gameLoopRef.current = setTimeout(moveSnake, calculateSpeed());
    };

    gameLoopRef.current = setTimeout(moveSnake, calculateSpeed());
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, food, generateFood, highScore, applySpeedEffect, showPowerUpMessage, t]);

  const closeGame = useCallback(() => {
    setShowGame(false);
    setIsPlaying(false);
    setGameOver(false);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    clearPowerUpTimers();
    setPowerUp(null);
    setActiveEffect(null);
    setPowerUpMessage(null);
    foodEatenRef.current = 0;
    effectMultiplierRef.current = 1;
    gameStartTimeRef.current = 0;
    directionQueueRef.current = [];
  }, [clearPowerUpTimers]);

  // Shared direction change function — queues inputs to prevent 180° reversal between ticks
  const changeDirection = useCallback((newDir: Direction) => {
    // Check against the last queued direction (or current if queue is empty)
    const lastDir = directionQueueRef.current.length > 0
      ? directionQueueRef.current[directionQueueRef.current.length - 1]
      : directionRef.current;

    const isOpposite =
      (newDir === 'UP' && lastDir === 'DOWN') ||
      (newDir === 'DOWN' && lastDir === 'UP') ||
      (newDir === 'LEFT' && lastDir === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDir === 'LEFT');

    if (!isOpposite && newDir !== lastDir) {
      // Max 2 queued inputs to stay responsive without overflow
      if (directionQueueRef.current.length < 2) {
        directionQueueRef.current.push(newDir);
      }
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!showGame) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
        case 'Escape':
          closeGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGame, changeDirection, closeGame]);

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
      {/* Clickable wrapper - keyboard accessible so the easter egg works without a mouse */}
      <div
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="RS"
        className="cursor-pointer"
      >
        {children}
      </div>

      {/* Toast — portaled to body to escape nav transform stacking context */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showToast && (
            <m.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-100"
            >
              <div className="relative px-5 py-3 rounded-xl text-sm font-medium text-foreground
                            bg-card/80 backdrop-blur-xl border border-primary/20
                            shadow-[0_0_30px_rgb(var(--theme-primary)/0.2),0_10px_40px_-10px_rgb(0_0_0/0.3)]">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 blur-xl -z-10" />
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-xl p-px bg-linear-to-r from-primary/50 via-accent/50 to-primary/50 -z-10">
                  <div className="w-full h-full rounded-xl bg-card/90" />
                </div>
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-primary" />
                  {toastMessage}
                </span>
              </div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Snake Game Modal — portaled to body to escape nav transform stacking context */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
        {showGame && (
          <m.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Snake"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center min-h-screen w-screen outline-none"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeGame()}
          >
            {/* Backdrop with blur and gradient */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />

            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 mx-4"
            >
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />

              {/* Main card */}
              <div className="relative bg-card backdrop-blur-xl rounded-2xl p-3 sm:p-6
                            border border-primary/20
                            shadow-[0_25px_50px_-12px_rgb(0_0_0/0.25),0_0_60px_rgb(var(--theme-primary)/0.15)]
                            max-h-[95dvh] overflow-y-auto">
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl p-px overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-primary via-accent to-primary animate-[spin_12s_linear_infinite] blur-sm opacity-50"
                       style={{ backgroundSize: '200% 200%' }} />
                </div>
                <div className="absolute inset-px rounded-2xl bg-card" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">🐍</span>
                      <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
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
                  <div className="flex justify-between items-center mb-3 sm:mb-5 px-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.easterEgg.score}</span>
                      <m.span
                        key={score}
                        initial={{ scale: 1.5, color: 'rgb(var(--theme-primary))' }}
                        animate={{ scale: 1, color: 'inherit' }}
                        className="text-xl sm:text-2xl font-bold text-foreground"
                      >
                        {score}
                      </m.span>
                    </div>

                    {/* Active effect indicator */}
                    <AnimatePresence>
                      {activeEffect && (
                        <m.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white"
                          style={{ backgroundColor: getComplementaryColor() }}
                        >
                          <span>{activeEffect.type === 'speed_down' ? '🐢' : '⚡'}</span>
                          <span>{activeEffect.remaining}s</span>
                        </m.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-500" /> {t.easterEgg.best}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-yellow-500">{highScore}</span>
                    </div>
                  </div>

                  {/* Game Board */}
                  <div
                    className="relative rounded-xl overflow-hidden touch-none"
                    style={{ width: GRID_SIZE * cellSize, height: GRID_SIZE * cellSize }}
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
                           backgroundSize: `${cellSize}px ${cellSize}px`
                         }} />

                    {/* Inner glow */}
                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgb(var(--theme-primary)/0.1)]" />

                    {/* Snake */}
                    {snake.map((segment, index) => {
                      const isHead = index === 0;
                      const opacity = 1 - (index * 0.03);
                      return (
                        <m.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute"
                          style={{
                            width: cellSize - 2,
                            height: cellSize - 2,
                            left: segment.x * cellSize + 1,
                            top: segment.y * cellSize + 1,
                          }}
                        >
                          {/* Segment glow */}
                          {isHead && (
                            <div className="absolute inset-0 bg-primary rounded-md blur-md opacity-60" />
                          )}
                          {/* Segment body */}
                          <div
                            className={`absolute inset-0 rounded-md ${isHead ? 'bg-linear-to-br from-primary to-accent' : 'bg-primary'}`}
                            style={{ opacity }}
                          />
                          {/* Segment shine */}
                          <div className="absolute inset-0 rounded-md bg-linear-to-br from-white/30 to-transparent"
                               style={{ height: '50%' }} />
                        </m.div>
                      );
                    })}

                    {/* Food */}
                    <m.div
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
                        width: cellSize - 2,
                        height: cellSize - 2,
                        left: food.x * cellSize + 1,
                        top: food.y * cellSize + 1,
                      }}
                    >
                      {/* Food glow */}
                      <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-70" />
                      {/* Food body */}
                      <div className="absolute inset-0 bg-linear-to-br from-accent to-primary rounded-full" />
                      {/* Food shine */}
                      <div className="absolute inset-1 bg-linear-to-br from-white/40 to-transparent rounded-full"
                           style={{ height: '40%' }} />
                    </m.div>

                    {/* Power-Up (looks identical to food — surprise on pickup) */}
                    <AnimatePresence>
                      {powerUp && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            scale: { duration: 0.8, repeat: Infinity },
                            rotate: { duration: 0.5, repeat: Infinity }
                          }}
                          className="absolute"
                          style={{
                            width: cellSize - 2,
                            height: cellSize - 2,
                            left: powerUp.position.x * cellSize + 1,
                            top: powerUp.position.y * cellSize + 1,
                          }}
                        >
                          {/* Same glow as food */}
                          <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-70" />
                          {/* Same body as food */}
                          <div className="absolute inset-0 bg-linear-to-br from-accent to-primary rounded-full" />
                          {/* Same shine as food */}
                          <div className="absolute inset-1 bg-linear-to-br from-white/40 to-transparent rounded-full"
                               style={{ height: '40%' }} />
                        </m.div>
                      )}
                    </AnimatePresence>

                    {/* Power-Up pickup message */}
                    <AnimatePresence>
                      {powerUpMessage && (
                        <m.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.8 }}
                          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                          style={{ backgroundColor: getComplementaryColor() }}
                        >
                          {powerUpMessage}
                        </m.div>
                      )}
                    </AnimatePresence>

                    {/* Particles */}
                    <AnimatePresence>
                      {particles.map((particle) => (
                        <m.div
                          key={particle.id}
                          initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 1,
                            opacity: 1
                          }}
                          animate={{
                            x: particle.x + particle.dx,
                            y: particle.y + particle.dy,
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
                        <m.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20"
                        >
                          <AnimatePresence mode="wait">
                            <m.div
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
                            </m.div>
                          </AnimatePresence>
                        </m.div>
                      )}
                    </AnimatePresence>

                    {/* Game Over Overlay */}
                    <AnimatePresence>
                      {gameOver && (
                        <m.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
                        >
                          <m.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="text-center"
                          >
                            <p className="text-3xl font-bold mb-2 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                              {t.easterEgg.gameOver}
                            </p>
                            <p className="text-muted-foreground mb-1">{t.easterEgg.score}: <span className="text-primary font-bold">{score}</span></p>
                            {score >= highScore && score > 0 && (
                              <m.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-yellow-500 text-sm font-medium mb-4 flex items-center justify-center gap-1"
                              >
                                <Trophy className="w-4 h-4" /> {t.easterEgg.newHighScore}
                              </m.p>
                            )}
                            <Button
                              onClick={startGame}
                              className="mt-2 bg-linear-to-r from-primary to-accent hover:opacity-90 text-white border-0"
                            >
                              {t.easterEgg.playAgain}
                            </Button>
                          </m.div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Desktop Controls hint */}
                  <p className="hidden sm:flex text-xs text-muted-foreground text-center mt-3 sm:mt-5 items-center justify-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">↑↓←→</kbd>
                    <span>{t.easterEgg.controlsOr}</span>
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">WASD</kbd>
                    <span className="mx-1">•</span>
                    <kbd className="px-2 py-1 rounded bg-secondary/50 border border-border text-[10px]">ESC</kbd>
                    <span>{t.easterEgg.controlsClose}</span>
                  </p>

                  {/* Mobile D-Pad Controls */}
                  <div className="sm:hidden mt-3">
                    <p className="text-[10px] text-muted-foreground text-center mb-2">{t.easterEgg.swipeOrButtons}</p>
                    <div className="flex flex-col items-center gap-0.5">
                      {/* Up */}
                      <button
                        onClick={() => changeDirection('UP')}
                        className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20 flex items-center justify-center
                                   active:bg-primary/20 active:scale-95 transition-all touch-none"
                      >
                        <ChevronUp className="w-5 h-5 text-primary" />
                      </button>
                      {/* Left, Down, Right */}
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => changeDirection('LEFT')}
                          className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronLeft className="w-5 h-5 text-primary" />
                        </button>
                        <button
                          onClick={() => changeDirection('DOWN')}
                          className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronDown className="w-5 h-5 text-primary" />
                        </button>
                        <button
                          onClick={() => changeDirection('RIGHT')}
                          className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20 flex items-center justify-center
                                     active:bg-primary/20 active:scale-95 transition-all touch-none"
                        >
                          <ChevronRight className="w-5 h-5 text-primary" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>,
        document.body
      )}
    </>
  );
}
