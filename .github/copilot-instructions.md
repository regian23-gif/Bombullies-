# Bombullies Project - Copilot Instructions

## Project Overview

This is a documentation-focused repository for Bombullies, a mobile application project with Firebase backend integration. The repository contains comprehensive guides for:
- Firebase configuration and deployment
- Google Play Store app publishing and signing
- GitHub Actions workflows for CI/CD

**Target Audience**: Developers and project maintainers working on Firebase-integrated mobile apps.

## Repository Structure

```
.
├── .github/
│   ├── workflows/          # GitHub Actions workflows
│   │   └── firebase-deploy.yml
│   └── copilot-instructions.md
├── FIREBASE_SETUP.md       # Detailed Firebase configuration guide
├── QUICK_REFERENCE.md      # Quick setup reference for Firebase secrets
├── GOOGLE_PLAY_SIGNED_BUNDLE_GUIDE.md  # Android App Bundle signing guide
├── PLAY_STORE_LISTING.md   # Play Store listing creation guide
├── FINAL_PLAYSTORE_UPLOAD.md  # Final upload and post-launch checklist
├── firebase-config.template.json  # Template for Firebase configuration
└── README.md               # Main project documentation
```

## Documentation Standards

### Writing Style
- Use clear, concise language suitable for technical documentation
- Write in second person ("you") for instructional content
- Include code examples where relevant
- Use emoji sparingly for visual organization (✅, ❌, 🔥, 📚, 🔒, 🚀)

### Markdown Formatting
- Use proper heading hierarchy (# for title, ## for major sections, ### for subsections)
- Include code blocks with appropriate language syntax highlighting
- Use tables for configuration references and comparisons
- Add links to related documentation sections
- Use blockquotes for important warnings or notes

### Documentation Structure
Each guide should include:
- Clear title and purpose statement
- Table of contents for longer documents
- Step-by-step instructions with numbered lists
- Troubleshooting section when applicable
- Links to official documentation and related resources

## Security Best Practices

- **NEVER** commit actual Firebase credentials, API keys, or secrets
- All sensitive configuration must use GitHub Secrets or environment variables
- Always reference `firebase-config.template.json` for structure, never include real values
- Ensure `.gitignore` excludes `firebase-config.json` and `.env` files
- Document security practices in relevant guides

## GitHub Workflows

### Firebase Deployment Workflow
- Located at `.github/workflows/firebase-deploy.yml`
- Uses GitHub Secrets for Firebase configuration
- Creates `firebase-config.json` dynamically during workflow execution
- Always validate configuration before deployment steps

### Workflow Best Practices
- Use latest stable versions of GitHub Actions
- Include descriptive step names
- Add validation steps to catch configuration errors early
- Document any required secrets in README and setup guides

## File Naming Conventions

- Use UPPERCASE with underscores for major documentation files (e.g., `FIREBASE_SETUP.md`)
- Use kebab-case for workflow files (e.g., `firebase-deploy.yml`)
- Use lowercase with hyphens for template files (e.g., `firebase-config.template.json`)

## Content Guidelines

### When Adding New Documentation
1. Follow the existing structure and style of similar documents
2. Add references to the new document in README.md
3. Cross-link related documentation
4. Include practical examples and commands
5. Add troubleshooting sections for common issues

### When Updating Firebase Documentation
- Update all related files (README.md, FIREBASE_SETUP.md, QUICK_REFERENCE.md)
- Verify secret names match across all documentation
- Update the firebase-config.template.json if structure changes
- Test all documented commands and workflows

### When Updating Play Store Guides
- Keep information current with Google Play Console interface
- Include references to screenshots where helpful
- Update version numbers and requirements
- Link to official Google Play documentation

## Configuration Files

### firebase-config.template.json
- Contains placeholder values for Firebase configuration
- Must maintain exact JSON structure required by Firebase SDK
- Use descriptive placeholder values (e.g., `YOUR_FIREBASE_API_KEY`)
- Never include actual credentials

### .gitignore
- Must exclude `firebase-config.json` (actual credentials)
- Should exclude common development artifacts
- Preserve existing entries when adding new patterns

## Links and References

### Always Link To
- Official Firebase documentation: https://firebase.google.com/docs
- GitHub Secrets documentation: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Google Play Console: https://play.google.com/console
- Related internal documentation

### Link Format
- Use descriptive link text (not "click here")
- Use relative links for internal documentation
- Use absolute URLs for external resources
- Verify all links are accessible

## Common Commands Reference

Since this is primarily a documentation repository, command examples should be accurate and tested:

```bash
# Firebase CLI (when applicable)
firebase login
firebase init
firebase deploy

# GitHub CLI (for secrets management)
gh secret set SECRET_NAME
gh secret list

# Git operations
git status
git add .
git commit -m "message"
git push
```

## Testing Documentation Changes

When updating documentation:
1. Review markdown rendering (check for broken links, formatting issues)
2. Verify code examples are syntactically correct
3. Test any command sequences in the appropriate environment
4. Check cross-references between documents
5. Ensure consistent terminology throughout

## Contributing to This Repository

- Make minimal, focused changes
- Update related documentation when changing configuration structure
- Add new guides following existing patterns
- Maintain consistency in formatting and style
- Keep security best practices in mind

## Keywords and Terminology

Use consistent terminology:
- "Firebase configuration" (not "Firebase config" or "Firebase settings")
- "GitHub Secrets" (capitalized)
- "GitHub Actions workflow" (not "GitHub workflow" alone)
- "Google Play Store" or "Play Store" (not "Google Store")
- "Android App Bundle" or "AAB" (not "APK bundle")
- "repository" (not "repo" in formal documentation) 
