# Firebase Secrets Setup Guide

This document explains how to configure Firebase secrets for the Bombullies- project using GitHub Secrets.

## Overview

Firebase requires several configuration values to connect your application to Firebase services. These values should be stored securely as GitHub Secrets rather than committed to the repository.

## Required Firebase Secrets

The following secrets need to be added to your GitHub repository:

1. **FIREBASE_API_KEY** - Your Firebase Web API Key
2. **FIREBASE_AUTH_DOMAIN** - Firebase Authentication Domain
3. **FIREBASE_PROJECT_ID** - Firebase Project ID
4. **FIREBASE_STORAGE_BUCKET** - Firebase Storage Bucket
5. **FIREBASE_MESSAGING_SENDER_ID** - Firebase Cloud Messaging Sender ID
6. **FIREBASE_APP_ID** - Firebase App ID
7. **FIREBASE_MEASUREMENT_ID** - Firebase Analytics Measurement ID (optional, only required if Google Analytics is enabled)

## How to Get Firebase Configuration Values

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you haven't added a web app yet, click "Add app" and select the web platform (</>)
7. You'll see a configuration object with all the values you need:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

## Adding Secrets to GitHub

### Method 1: Using GitHub Web Interface

1. Navigate to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret one by one:
   - Name: `FIREBASE_API_KEY`
   - Value: Your actual API key value
   - Click **Add secret**
6. Repeat for all required secrets

### Method 2: Using GitHub CLI

If you have [GitHub CLI](https://cli.github.com/) installed:

```bash
gh secret set FIREBASE_API_KEY
gh secret set FIREBASE_AUTH_DOMAIN
gh secret set FIREBASE_PROJECT_ID
gh secret set FIREBASE_STORAGE_BUCKET
gh secret set FIREBASE_MESSAGING_SENDER_ID
gh secret set FIREBASE_APP_ID
gh secret set FIREBASE_MEASUREMENT_ID
```

You'll be prompted to enter the value for each secret.

## Using Secrets in GitHub Actions

Once secrets are configured, you can use them in your GitHub Actions workflows:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Create Firebase Config
        run: |
          cat > firebase-config.json << EOF
          {
            "apiKey": "${{ secrets.FIREBASE_API_KEY }}",
            "authDomain": "${{ secrets.FIREBASE_AUTH_DOMAIN }}",
            "projectId": "${{ secrets.FIREBASE_PROJECT_ID }}",
            "storageBucket": "${{ secrets.FIREBASE_STORAGE_BUCKET }}",
            "messagingSenderId": "${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}",
            "appId": "${{ secrets.FIREBASE_APP_ID }}",
            "measurementId": "${{ secrets.FIREBASE_MEASUREMENT_ID }}"
          }
          EOF
      
      - name: Deploy to Firebase
        run: |
          # Your deployment commands here
```

## Using Secrets in Your Application

### For JavaScript/Node.js Applications

Create a configuration file that reads from environment variables:

```javascript
// firebaseConfig.js
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export default firebaseConfig;
```

### For Local Development

Create a `.env` file in your project root (this file is git-ignored):

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_APP_ID=1:1234567890:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Then use a library like `dotenv` to load these variables:

```javascript
require('dotenv').config();
```

## Security Best Practices

1. ✅ **DO** store Firebase configuration in GitHub Secrets
2. ✅ **DO** add `firebase-config.json` and `.env` files to `.gitignore`
3. ✅ **DO** use different Firebase projects for development, staging, and production
4. ✅ **DO** rotate API keys periodically
5. ❌ **DON'T** commit Firebase configuration files to the repository
6. ❌ **DON'T** share Firebase secrets in public channels
7. ❌ **DON'T** expose secrets in client-side code without proper security rules

## Verifying Your Setup

To verify your secrets are properly configured:

1. Check that all required secrets appear in your repository settings
2. Run a test GitHub Action workflow that uses the secrets
3. Ensure your application can successfully connect to Firebase services

## Troubleshooting

### Secrets Not Available in Workflow
- Ensure secrets are added at the repository level (not organization or environment level)
- Check that the workflow has the correct permissions
- Verify the secret names match exactly (they are case-sensitive)

### Firebase Connection Errors
- Verify all configuration values are correct
- Check that Firebase services are enabled in your Firebase Console
- Ensure Firebase Security Rules allow the operations you're attempting

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## Support

If you encounter issues:
1. Check the Firebase Console for any service outages
2. Review GitHub Actions logs for specific error messages
3. Consult the Firebase documentation for your specific use case
