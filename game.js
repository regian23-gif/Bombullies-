// Game Configuration
const CONFIG = {
    TILE_SIZE: 40,
    GRID_WIDTH: 20,
    GRID_HEIGHT: 15,
    PLAYER_SPEED: 2,
    BOMB_TIMER: 3000,
    EXPLOSION_DURATION: 500,
    FPS: 60
};

// Game State
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

// Cell Types
const CELL = {
    EMPTY: 0,
    WALL: 1,
    BREAKABLE: 2,
    BOMB: 3,
    EXPLOSION: 4,
    POWERUP_SPEED: 5,
    POWERUP_RANGE: 6,
    POWERUP_BOMBS: 7
};

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.grid = [];
        this.player = null;
        this.bombs = [];
        this.explosions = [];
        this.powerups = [];
        this.keys = {};
        this.lastFrameTime = Date.now();
        
        this.initializeGrid();
        this.initializePlayer();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
            this.grid[y] = [];
            for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
                // Create walls around the border
                if (x === 0 || x === CONFIG.GRID_WIDTH - 1 || 
                    y === 0 || y === CONFIG.GRID_HEIGHT - 1) {
                    this.grid[y][x] = CELL.WALL;
                }
                // Create grid pattern of walls
                else if (x % 2 === 0 && y % 2 === 0) {
                    this.grid[y][x] = CELL.WALL;
                }
                // Add breakable walls randomly
                else if (Math.random() < 0.5 && !(x <= 2 && y <= 2)) {
                    this.grid[y][x] = CELL.BREAKABLE;
                } else {
                    this.grid[y][x] = CELL.EMPTY;
                }
            }
        }
    }

    initializePlayer() {
        this.player = {
            x: 1.5,
            y: 1.5,
            speed: CONFIG.PLAYER_SPEED,
            bombRange: 2,
            maxBombs: 1,
            activeBombs: 0
        };
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ' && this.state === GAME_STATE.PLAYING) {
                e.preventDefault();
                this.placeBomb();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Button controls
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('pauseButton').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('resetButton').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
    }

    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.lastFrameTime = Date.now();
        document.getElementById('startButton').disabled = true;
        document.getElementById('pauseButton').disabled = false;
        document.getElementById('gameOverModal').classList.add('hidden');
        this.gameLoop();
    }

    togglePause() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
            document.getElementById('pauseButton').textContent = 'Resume';
        } else if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
            this.lastFrameTime = Date.now(); // Reset frame time to avoid jump
            document.getElementById('pauseButton').textContent = 'Pause';
            this.gameLoop();
        }
    }

    resetGame() {
        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bombs = [];
        this.explosions = [];
        this.powerups = [];
        this.lastFrameTime = Date.now();
        this.initializeGrid();
        this.initializePlayer();
        this.updateUI();
        this.render();
        
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('pauseButton').textContent = 'Pause';
        document.getElementById('gameOverModal').classList.add('hidden');
    }

    placeBomb() {
        if (this.player.activeBombs >= this.player.maxBombs) return;

        const gridX = Math.floor(this.player.x);
        const gridY = Math.floor(this.player.y);

        // Check if there's already a bomb at this position
        const existingBomb = this.bombs.find(b => b.gridX === gridX && b.gridY === gridY);
        if (existingBomb) return;

        const bomb = {
            gridX: gridX,
            gridY: gridY,
            timer: CONFIG.BOMB_TIMER,
            range: this.player.bombRange
        };

        this.bombs.push(bomb);
        this.player.activeBombs++;

        setTimeout(() => {
            this.explodeBomb(bomb);
        }, CONFIG.BOMB_TIMER);
    }

    explodeBomb(bomb) {
        const index = this.bombs.indexOf(bomb);
        if (index === -1) return;

        this.bombs.splice(index, 1);
        this.player.activeBombs--;

        // Create explosion at bomb location
        const explosionCells = [[bomb.gridX, bomb.gridY]];

        // Spread explosion in 4 directions
        const directions = [
            [0, -1], // up
            [0, 1],  // down
            [-1, 0], // left
            [1, 0]   // right
        ];

        for (const [dx, dy] of directions) {
            for (let i = 1; i <= bomb.range; i++) {
                const x = bomb.gridX + dx * i;
                const y = bomb.gridY + dy * i;

                if (x < 0 || x >= CONFIG.GRID_WIDTH || 
                    y < 0 || y >= CONFIG.GRID_HEIGHT) break;

                const cell = this.grid[y][x];

                if (cell === CELL.WALL) break;

                explosionCells.push([x, y]);

                if (cell === CELL.BREAKABLE) {
                    this.grid[y][x] = CELL.EMPTY;
                    this.score += 10;
                    
                    // Random chance to spawn power-up
                    if (Math.random() < 0.3) {
                        const powerupTypes = [CELL.POWERUP_SPEED, CELL.POWERUP_RANGE, CELL.POWERUP_BOMBS];
                        const powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
                        this.powerups.push({ x, y, type: powerupType });
                    }
                    break;
                }
            }
        }

        // Create explosion effect with timestamp
        explosionCells.forEach(([x, y]) => {
            this.explosions.push({
                x, y,
                startTime: Date.now(),
                duration: CONFIG.EXPLOSION_DURATION
            });

            // Check if player is hit
            if (Math.floor(this.player.x) === x && Math.floor(this.player.y) === y) {
                this.playerHit();
            }
        });
    }

    playerHit() {
        this.lives--;
        this.updateUI();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn player at starting position
            this.player.x = 1.5;
            this.player.y = 1.5;
        }
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        document.getElementById('gameOverTitle').textContent = 'Game Over!';
        document.getElementById('gameOverMessage').innerHTML = `Your score: <span id="finalScore">${this.score}</span>`;
        document.getElementById('gameOverModal').classList.remove('hidden');
        document.getElementById('pauseButton').disabled = true;
    }

    update(deltaTime) {
        if (this.state !== GAME_STATE.PLAYING) return;

        // Clean up expired explosions
        const currentTime = Date.now();
        this.explosions = this.explosions.filter(e => 
            currentTime - e.startTime < e.duration
        );

        // Update player movement with deltaTime
        let newX = this.player.x;
        let newY = this.player.y;
        const speed = (this.player.speed / 1000) * deltaTime; // Convert to per-millisecond

        if (this.keys['ArrowUp'] || this.keys['w']) newY -= speed;
        if (this.keys['ArrowDown'] || this.keys['s']) newY += speed;
        if (this.keys['ArrowLeft'] || this.keys['a']) newX -= speed;
        if (this.keys['ArrowRight'] || this.keys['d']) newX += speed;

        // Collision detection with walls
        if (this.canMoveTo(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
        } else if (this.canMoveTo(newX, this.player.y)) {
            this.player.x = newX;
        } else if (this.canMoveTo(this.player.x, newY)) {
            this.player.y = newY;
        }

        // Check for power-up collection
        const playerGridX = Math.floor(this.player.x);
        const playerGridY = Math.floor(this.player.y);
        
        this.powerups = this.powerups.filter(powerup => {
            if (powerup.x === playerGridX && powerup.y === playerGridY) {
                this.collectPowerup(powerup);
                return false;
            }
            return true;
        });
    }

    canMoveTo(x, y) {
        // Check bounds
        if (x < 0.5 || x >= CONFIG.GRID_WIDTH - 0.5 || 
            y < 0.5 || y >= CONFIG.GRID_HEIGHT - 0.5) {
            return false;
        }

        // Check collision with walls and breakable blocks
        const corners = [
            [x - 0.4, y - 0.4], [x + 0.4, y - 0.4],
            [x - 0.4, y + 0.4], [x + 0.4, y + 0.4]
        ];

        for (const [cx, cy] of corners) {
            const gridX = Math.floor(cx);
            const gridY = Math.floor(cy);
            
            if (gridX < 0 || gridX >= CONFIG.GRID_WIDTH || 
                gridY < 0 || gridY >= CONFIG.GRID_HEIGHT) {
                return false;
            }

            const cell = this.grid[gridY][gridX];
            if (cell === CELL.WALL || cell === CELL.BREAKABLE) {
                return false;
            }

            // Can't move through bombs (but can move away from them)
            const bomb = this.bombs.find(b => b.gridX === gridX && b.gridY === gridY);
            if (bomb) {
                const playerGridX = Math.floor(this.player.x);
                const playerGridY = Math.floor(this.player.y);
                if (!(playerGridX === gridX && playerGridY === gridY)) {
                    return false;
                }
            }
        }

        return true;
    }

    collectPowerup(powerup) {
        this.score += 50;
        
        switch (powerup.type) {
            case CELL.POWERUP_SPEED:
                this.player.speed = Math.min(this.player.speed + 0.5, 5);
                break;
            case CELL.POWERUP_RANGE:
                this.player.bombRange = Math.min(this.player.bombRange + 1, 6);
                break;
            case CELL.POWERUP_BOMBS:
                this.player.maxBombs = Math.min(this.player.maxBombs + 1, 5);
                break;
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
            for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
                const cell = this.grid[y][x];
                const px = x * CONFIG.TILE_SIZE;
                const py = y * CONFIG.TILE_SIZE;

                if (cell === CELL.WALL) {
                    this.ctx.fillStyle = '#34495e';
                    this.ctx.fillRect(px, py, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                    this.ctx.strokeStyle = '#2c3e50';
                    this.ctx.strokeRect(px, py, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                } else if (cell === CELL.BREAKABLE) {
                    this.ctx.fillStyle = '#95a5a6';
                    this.ctx.fillRect(px, py, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(px + 4, py + 4, CONFIG.TILE_SIZE - 8, CONFIG.TILE_SIZE - 8);
                }
            }
        }

        // Draw power-ups
        this.powerups.forEach(powerup => {
            const px = powerup.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
            const py = powerup.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
            
            this.ctx.fillStyle = '#f39c12';
            this.ctx.beginPath();
            this.ctx.arc(px, py, CONFIG.TILE_SIZE / 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '';
            if (powerup.type === CELL.POWERUP_SPEED) symbol = '⚡';
            else if (powerup.type === CELL.POWERUP_RANGE) symbol = '💥';
            else if (powerup.type === CELL.POWERUP_BOMBS) symbol = '🔢';
            
            this.ctx.fillText(symbol, px, py);
        });

        // Draw bombs
        this.bombs.forEach(bomb => {
            const px = bomb.gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
            const py = bomb.gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
            
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.beginPath();
            this.ctx.arc(px, py, CONFIG.TILE_SIZE / 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('💣', px, py);
        });

        // Draw explosions
        this.explosions.forEach(explosion => {
            const px = explosion.x * CONFIG.TILE_SIZE;
            const py = explosion.y * CONFIG.TILE_SIZE;
            
            this.ctx.fillStyle = 'rgba(241, 196, 15, 0.8)';
            this.ctx.fillRect(px, py, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
            
            this.ctx.fillStyle = 'rgba(230, 126, 34, 0.6)';
            this.ctx.fillRect(px + 5, py + 5, CONFIG.TILE_SIZE - 10, CONFIG.TILE_SIZE - 10);
        });

        // Draw player
        const px = this.player.x * CONFIG.TILE_SIZE;
        const py = this.player.y * CONFIG.TILE_SIZE;
        
        this.ctx.fillStyle = '#3498db';
        this.ctx.beginPath();
        this.ctx.arc(px, py, CONFIG.TILE_SIZE / 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('😎', px, py);

        // Draw pause overlay
        if (this.state === GAME_STATE.PAUSED) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    gameLoop() {
        if (this.state === GAME_STATE.PLAYING) {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        } else if (this.state === GAME_STATE.PAUSED) {
            this.render();
        }
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new Game();
    game.render();
});
