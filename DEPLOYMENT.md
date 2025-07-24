# 🚀 Deployment Guide

## GitHub Pages Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Save the settings

### 2. Configure Repository Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**
4. Save the changes

### 3. Push Your Changes

The GitHub Actions workflows will automatically:

- **Build** the React application
- **Run tests** to ensure everything works
- **Deploy** to GitHub Pages

```bash
git add .
git commit -m "Add GitHub Actions workflows for deployment"
git push origin main
```

### 4. Monitor Deployment

1. Go to **Actions** tab in your repository
2. You'll see two workflows running:
   - **Build and Deploy to GitHub Pages** - builds and deploys
   - **Test** - runs tests and generates coverage

### 5. Access Your App

Once deployment is complete, your app will be available at:
`https://maximeliseyev.github.io/filmdevcalculator`

## Workflow Details

### deploy.yml

This workflow:
- ✅ Runs on Node.js 18
- ✅ Installs dependencies with `npm ci`
- ✅ Builds the project with `npm run build`
- ✅ Uploads build artifacts
- ✅ Deploys to GitHub Pages (only on main branch)

### test.yml

This workflow:
- ✅ Runs tests on Node.js 18 and 20
- ✅ Installs dependencies
- ✅ Runs tests with coverage
- ✅ Uploads coverage reports to Codecov

## Troubleshooting

### Common Issues

1. **Build fails**
   - Check that all dependencies are in `package.json`
   - Ensure `homepage` field is set correctly in `package.json`

2. **Deployment fails**
   - Verify GitHub Pages is enabled
   - Check repository permissions
   - Ensure you're pushing to `main` branch

3. **Tests fail**
   - Review test output in Actions tab
   - Fix any failing tests before deployment

### Manual Deployment

If you need to deploy manually:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The build folder contains production files
# You can upload these to any static hosting service
```

## Environment Variables

The project uses these environment variables:

- `REACT_APP_VERSION` - App version (auto-generated)
- `PUBLIC_URL` - Base URL for assets (set by React)

## Security

- ✅ All workflows use latest GitHub Actions
- ✅ Dependencies are cached for faster builds
- ✅ Only deploys from `main` branch
- ✅ Uses GitHub's built-in security features

## Performance

- ✅ Build artifacts are cached
- ✅ Dependencies are cached
- ✅ Parallel test execution
- ✅ Optimized for React production builds 