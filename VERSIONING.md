# Versioning Strategy

This document outlines the versioning strategy for the Editor project, ensuring consistency between package.json and CI/CD releases.

## Overview

Our CI/CD pipeline automatically creates releases based on the version specified in `package.json`, following semantic versioning principles.

## Current Version

The current version is: **0.1.10** (as specified in package.json)

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/) with the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

### Pre-release Versions

For pre-release versions, append a hyphen and identifier:

- `1.0.0-alpha.1`
- `1.0.0-beta.2`
- `1.0.0-rc.1`

## Workflow Integration

### Automatic Release Creation

When code is pushed to the `main` branch:

1. **Version Extraction**: The CI/CD workflow extracts the version from `package.json`
2. **Release Creation**: Creates a GitHub release with tag `v{version}`
3. **Artifact Naming**: APK files are named `editor-v{version}.apk`
4. **Duplicate Handling**: If a release already exists, artifacts are uploaded to the existing release

### Version Validation

For pull requests that modify `package.json`:

1. **Semantic Validation**: Ensures version follows semver format
2. **Increment Validation**: Confirms version has been properly incremented
3. **Conflict Detection**: Checks if a release with the same version already exists
4. **PR Comments**: Automatically comments on PRs with validation results

## Best Practices

### For Developers

1. **Always Update package.json**: Before merging to main, ensure `package.json` version is updated
2. **Follow Semver**: Use appropriate version increments based on change type
3. **Check Existing Releases**: Verify the version doesn't already exist
4. **Use Descriptive Commits**: Include version changes in commit messages

### Version Increment Guidelines

| Change Type      | Version Increment | Example                |
| ---------------- | ----------------- | ---------------------- |
| Bug fixes        | PATCH             | 0.1.10 → 0.1.11        |
| New features     | MINOR             | 0.1.10 → 0.2.0         |
| Breaking changes | MAJOR             | 0.1.10 → 1.0.0         |
| Pre-release      | Add identifier    | 0.1.10 → 0.2.0-alpha.1 |

### Release Process

1. **Development**: Work on feature/bug fix branches
2. **Version Update**: Update `package.json` version before creating PR
3. **PR Review**: Version validation workflow runs automatically
4. **Merge**: After approval, merge to main
5. **Automatic Release**: CI/CD creates release with APK artifacts

## Troubleshooting

### Common Issues

**Version Not Updated**

- Error: "Version has not been updated"
- Solution: Increment version in package.json

**Invalid Semver Format**

- Error: "Version does not follow semantic versioning format"
- Solution: Use format MAJOR.MINOR.PATCH (e.g., 1.2.3)

**Release Already Exists**

- Warning: "Release already exists"
- Options:
  - Increment to new version
  - Accept that artifacts will be added to existing release

**Version Regression**

- Error: "Version must be greater than previous version"
- Solution: Ensure new version is higher than current main branch version

## Manual Version Management

### Using npm version command

```bash
# Patch increment (0.1.10 → 0.1.11)
npm version patch

# Minor increment (0.1.10 → 0.2.0)
npm version minor

# Major increment (0.1.10 → 1.0.0)
npm version major

# Pre-release increment (0.1.10 → 0.1.11-0)
npm version prerelease

# Specific version
npm version 1.2.3
```

### Git Tags

The CI/CD workflow automatically creates git tags in the format `v{version}`. These tags are synchronized with GitHub releases.

## Monitoring

### GitHub Actions

- **Android CI**: Builds and releases APK with version from package.json
- **Version Validation**: Validates version changes in pull requests

### Artifacts

All build artifacts include the version number:

- APK files: `editor-v{version}.apk`
- GitHub releases: `v{version}`
- Artifact uploads: `editor-v{version}-apk`

## Future Enhancements

Potential improvements to consider:

1. **iOS Release Integration**: Extend versioning to iOS builds
2. **Changelog Generation**: Automatic changelog based on commits
3. **Version Bumping Automation**: Automatic version increments based on commit types
4. **Release Notes**: Enhanced release notes from PR descriptions
5. **Multi-platform Releases**: Coordinate releases across platforms

---

For questions or issues with versioning, please check the GitHub Actions logs or create an issue in the repository.
