# Bombullies 💣

A classic Bomberman-style game built with HTML5 Canvas and JavaScript, configured with Firebase integration for future multiplayer features.

## 🎮 How to Play

1. Open `index.html` in a web browser
2. Click "Start Game" to begin
3. Use arrow keys (↑↓←→) to move your character
4. Press Space to place bombs
5. Destroy breakable walls to clear the path and earn points
6. Collect power-ups:
   - ⚡ Speed Boost - Move faster
   - 💥 Bomb Range - Larger explosions
   - 🔢 Extra Bomb - Place more bombs simultaneously
7. Avoid your own explosions or you'll lose a life!

## 🎯 Game Features

- Classic Bomberman-style gameplay
- Grid-based movement and bombing system
- Multiple power-ups to collect
- Score tracking and lives system
- Responsive controls (keyboard)
- Destructible walls
- Bomb chain reactions

## 🚀 Quick Start

### Option 1: Direct Browser (Simplest)
1. Download or clone this repository
2. Open `index.html` directly in your web browser
3. Click "Start Game" and enjoy!

### Option 2: Local Server (Recommended for development)
```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Or using PHP
php -S localhost:8080
```
Then navigate to `http://localhost:8080` in your browser.

## 🔥 Firebase Setup

This project uses Firebase for backend services. To set up Firebase secrets for GitHub Actions and local development, please follow the comprehensive guide in [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

### Quick Start

1. **Configure Firebase Secrets in GitHub:**
   - Navigate to your repository Settings → Secrets and variables → Actions
   - Add the following secrets (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions):
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`
     - `FIREBASE_MEASUREMENT_ID`

2. **For Local Development:**
   - Copy `firebase-config.template.json` to `firebase-config.json`
   - Fill in your Firebase configuration values
   - The file is git-ignored for security

3. **GitHub Actions:**
   - See `.github/workflows/firebase-deploy.yml` for an example workflow
   - The workflow automatically creates the Firebase configuration from secrets

## 📚 Documentation

- [Game Documentation](GAME_DOCUMENTATION.md) - Complete guide to game mechanics, controls, and technical details
- [Firebase Setup Guide](FIREBASE_SETUP.md) - Complete guide for configuring Firebase secrets
- [Quick Reference](QUICK_REFERENCE.md) - Quick setup guide for Firebase secrets
- [Firebase Config Template](firebase-config.template.json) - JSON template with placeholder values for Firebase configuration

## 🔒 Security

- Never commit `firebase-config.json` or `.env` files to the repository
- All sensitive Firebase configuration is stored in GitHub Secrets
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for security best practices

## 🚀 Deployment

Firebase deployment is automated through GitHub Actions. See the example workflow at `.github/workflows/firebase-deploy.yml`.

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)