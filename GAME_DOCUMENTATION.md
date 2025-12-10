# Bombullies Game Documentation 💣

## Overview

Bombullies is a classic Bomberman-style game built with HTML5 Canvas and JavaScript. The game features strategic bomb placement, power-ups, destructible walls, and progressive difficulty.

## Game Mechanics

### Objective

- Destroy breakable walls to clear the playing field
- Collect power-ups to enhance your abilities
- Survive as long as possible without being caught in explosions
- Earn the highest score possible

### Controls

| Key | Action |
|-----|--------|
| ↑ / W | Move Up |
| ↓ / S | Move Down |
| ← / A | Move Left |
| → / D | Move Right |
| Space | Place Bomb |

### Game Elements

#### Player Character (😎)
- Starts with 3 lives
- Can be upgraded with power-ups
- Respawns at starting position after losing a life

#### Walls
- **Solid Walls** (Dark Gray): Indestructible obstacles that form the game grid
- **Breakable Walls** (Light Gray): Can be destroyed with bombs, worth 10 points each

#### Bombs (💣)
- Timer: 3 seconds before explosion
- Default range: 2 tiles in each direction
- Player can only place a limited number of bombs at once (default: 1)
- Cannot walk through bombs once placed (but can walk away)

#### Explosions
- Spread in 4 directions (up, down, left, right)
- Destroy breakable walls in their path
- Stop when hitting solid walls
- Can hurt the player if caught in the blast
- Duration: 0.5 seconds

#### Power-ups
Power-ups have a 30% chance to appear when destroying breakable walls:

- **⚡ Speed Boost**: Increases player movement speed
- **💥 Bomb Range**: Increases explosion range by 1 tile
- **🔢 Extra Bomb**: Allows placing one more bomb simultaneously

### Scoring System

| Action | Points |
|--------|--------|
| Destroy breakable wall | 10 |
| Collect power-up | 50 |

## Game States

1. **Menu**: Initial state, waiting for player to start
2. **Playing**: Active gameplay
3. **Paused**: Game paused, can be resumed
4. **Game Over**: All lives lost

## Technical Details

### Architecture

The game is built using:
- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** for game logic (ES6+ class-based)
- **CSS3** for UI styling
- **RequestAnimationFrame** for smooth 60 FPS gameplay

### Code Structure

```
game.js
├── CONFIG: Game configuration constants
├── GAME_STATE: State machine definitions
├── CELL: Grid cell type definitions
└── Game Class
    ├── Constructor & Initialization
    ├── Grid Management
    ├── Player Management
    ├── Bomb System
    ├── Explosion System
    ├── Power-up System
    ├── Collision Detection
    ├── Rendering Engine
    └── Game Loop
```

### Configuration

Key configurable parameters in `CONFIG` object:

```javascript
TILE_SIZE: 40,         // Size of each grid tile in pixels
GRID_WIDTH: 20,        // Number of tiles horizontally
GRID_HEIGHT: 15,       // Number of tiles vertically
PLAYER_SPEED: 2,       // Base player speed
BOMB_TIMER: 3000,      // Time before bomb explodes (ms)
EXPLOSION_DURATION: 500 // How long explosions last (ms)
```

### Grid System

The game uses a 2D grid where each cell can be:
- `EMPTY (0)`: Passable space
- `WALL (1)`: Solid, indestructible wall
- `BREAKABLE (2)`: Destructible wall
- `BOMB (3)`: Active bomb
- `EXPLOSION (4)`: Active explosion
- `POWERUP_SPEED (5)`: Speed boost power-up
- `POWERUP_RANGE (6)`: Range boost power-up
- `POWERUP_BOMBS (7)`: Extra bomb power-up

### Collision Detection

The game uses a sophisticated collision system:
- Player hitbox is smaller than a full tile (0.8 tiles)
- Checks all 4 corners of player for wall collisions
- Allows sliding along walls for smoother movement
- Prevents walking through bombs (except from starting position)

## Game Balance

### Starting Stats
- Lives: 3
- Speed: 2.0
- Bomb Range: 2 tiles
- Max Bombs: 1

### Power-up Limits
- Maximum Speed: 5.0
- Maximum Bomb Range: 6 tiles
- Maximum Simultaneous Bombs: 5

### Level Generation
- Border walls are always solid
- Grid pattern of solid walls (every 2nd row and column)
- 50% chance for breakable walls in empty spaces
- Starting area (top-left 3x3) is always clear

## Future Enhancements

Potential features for future versions:
- Multiple levels with increasing difficulty
- Enemy AI characters
- Multiplayer mode (using Firebase)
- Leaderboard system (using Firebase)
- More power-up types
- Special bomb types (remote detonation, etc.)
- Sound effects and music
- Mobile touch controls
- Save/load game state
- Achievements system

## Firebase Integration

The project is configured with Firebase for future enhancements:
- Real-time multiplayer gameplay
- Cloud-based leaderboards
- User authentication and profiles
- Game state synchronization

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase configuration details.

## Browser Compatibility

The game works in all modern browsers that support:
- HTML5 Canvas API
- ES6+ JavaScript (Classes, Arrow Functions, etc.)
- RequestAnimationFrame API

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Target: 60 FPS
- Canvas size: 800x600 pixels
- Grid size: 20x15 tiles
- Lightweight rendering (no heavy image processing)
- Efficient collision detection

## Troubleshooting

### Game doesn't start
- Ensure JavaScript is enabled in your browser
- Check browser console for errors
- Verify all files (index.html, game.js, styles.css) are in the same directory

### Controls not working
- Click on the game canvas to ensure it has focus
- Check that keyboard shortcuts in your browser aren't interfering
- Try using both arrow keys and WASD keys

### Performance issues
- Close other tabs/applications to free up resources
- Try a different browser
- Reduce browser zoom level to 100%

## Contributing

To modify or extend the game:

1. **Adding new power-ups**: 
   - Add new CELL type constant
   - Update `collectPowerup()` method
   - Add visual representation in `render()` method

2. **Changing game difficulty**:
   - Modify CONFIG constants
   - Adjust power-up spawn rates
   - Change starting player stats

3. **Adding enemies**:
   - Create enemy class/system
   - Implement AI movement logic
   - Add collision detection with player
   - Integrate with rendering system

## License

This is an educational project demonstrating game development with HTML5 Canvas.

## Credits

Developed as a demonstration of:
- HTML5 Canvas game development
- Object-oriented JavaScript
- Game state management
- Collision detection algorithms
- Real-time rendering techniques
