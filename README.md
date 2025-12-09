# Bombullies-

A project configured with Firebase integration.

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

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Complete guide for configuring Firebase secrets
- [Firebase Config Template](firebase-config.template.json) - Template for local configuration

## 🔒 Security

- Never commit `firebase-config.json` or `.env` files to the repository
- All sensitive Firebase configuration is stored in GitHub Secrets
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for security best practices

## 🚀 Deployment

Firebase deployment is automated through GitHub Actions. See the example workflow at `.github/workflows/firebase-deploy.yml`.

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)