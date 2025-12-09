# Quick Reference: Setting Up Firebase Secrets

## Required GitHub Secrets

Add these secrets to your GitHub repository under **Settings** → **Secrets and variables** → **Actions**:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSyC...` |
| `FIREBASE_AUTH_DOMAIN` | Authentication domain | `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `your-project` |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket URL | `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID | `123456789` |
| `FIREBASE_APP_ID` | Firebase app ID | `1:123456789:web:abc123` |
| `FIREBASE_MEASUREMENT_ID` | Analytics measurement ID | `G-XXXXXXXXXX` |

## Quick Setup Steps

### 1. Get Firebase Config
```bash
# Visit Firebase Console
https://console.firebase.google.com/

# Navigate to: Project Settings → Your apps → Web app config
```

### 2. Add to GitHub (Web UI)
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

### 3. Add to GitHub (CLI)
```bash
gh secret set FIREBASE_API_KEY
gh secret set FIREBASE_AUTH_DOMAIN
gh secret set FIREBASE_PROJECT_ID
gh secret set FIREBASE_STORAGE_BUCKET
gh secret set FIREBASE_MESSAGING_SENDER_ID
gh secret set FIREBASE_APP_ID
gh secret set FIREBASE_MEASUREMENT_ID
```

### 4. For Local Development
```bash
# Copy template
cp firebase-config.template.json firebase-config.json

# Edit with your values
# (This file is already in .gitignore)
```

## Verification

After adding secrets, verify by:
1. Checking they appear in repository settings
2. Running the GitHub Actions workflow
3. Checking workflow logs for successful Firebase config creation

## Need Help?

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions and troubleshooting.
