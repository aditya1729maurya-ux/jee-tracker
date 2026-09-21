# Build notes

This package intentionally does not include an `android/` directory. GitHub Actions creates the Capacitor Android platform during the build, keeping the repository smaller and avoiding generated native files in source control.

The existing App.tsx is preserved as supplied. No Gemini secret is embedded in it.
