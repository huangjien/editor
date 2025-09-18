# React Native Development Constitution

## Core Principles

### I. Library-First Architecture

Every feature starts as a standalone, reusable library component. Libraries must be:

- Self-contained with clear dependencies (React Native, Expo, or native modules)
- Independently testable on iOS and Android simulators/devices
- Documented with usage examples and API reference
- Published to npm with proper versioning
- Clear purpose required - no organizational-only libraries

### II. CLI Interface & Tooling

Every library exposes functionality via CLI tools and development scripts:

- Text in/out protocol: stdin/args → stdout, errors → stderr
- Support JSON + human-readable formats for data exchange
- Metro bundler integration for development and production builds
- Expo CLI compatibility for managed workflow projects
- React Native CLI support for bare workflow projects

### III. Test-First Development (NON-NEGOTIABLE)

TDD mandatory across all React Native development:

- Tests written → User approved → Tests fail → Then implement
- Red-Green-Refactor cycle strictly enforced
- Unit tests for components using React Native Testing Library
- Integration tests for navigation flows and API interactions
- End-to-end tests using Detox for critical user journeys

### IV. Cross-Platform Integration Testing

Focus areas requiring comprehensive integration testing:

- iOS and Android platform-specific implementations
- Native module contract tests and bridge communication
- Navigation library integration (React Navigation, etc.)
- State management integration (Redux, Zustand, Context API)
- Third-party SDK integrations (Firebase, analytics, etc.)
- Device-specific features (camera, location, push notifications)

### V. Observability & Performance Monitoring

Comprehensive monitoring and debugging capabilities:

- Flipper integration for development debugging
- React Native performance monitoring (Flipper, React DevTools)
- Crash reporting integration (Crashlytics, Sentry)
- Analytics tracking for user interactions and app performance
- Bundle size monitoring and optimization tracking
- Memory leak detection and performance profiling

### VI. Versioning & Platform Compatibility

Strict version management for React Native ecosystem:

- MAJOR.MINOR.PATCH semantic versioning
- React Native version compatibility matrix maintenance
- iOS/Android minimum version requirements documentation
- Breaking changes require migration guides and deprecation notices
- Expo SDK version alignment for managed workflow projects
- Native dependency version locking and conflict resolution

### VII. Simplicity & Performance First

Start simple, optimize for mobile performance:

- YAGNI principles - avoid over-engineering mobile solutions
- Bundle size optimization - code splitting and lazy loading
- Native performance considerations - avoid unnecessary re-renders
- Memory management - proper cleanup of listeners and subscriptions
- Battery optimization - efficient background task handling
- Network efficiency - caching, offline support, and data compression

## React Native Technology Stack

### Core Dependencies

- **React Native**: Latest stable version with platform-specific considerations
- **TypeScript**: Mandatory for type safety and better developer experience
- **Metro**: Default bundler with custom configuration for optimization
- **Flipper**: Development debugging and performance monitoring
- **React Native Testing Library**: Component testing framework
- **Detox**: End-to-end testing for iOS and Android

### Navigation & State Management

- **React Navigation**: Primary navigation library with deep linking support
- **Redux Toolkit** or **Zustand**: State management based on app complexity
- **React Query/TanStack Query**: Server state management and caching
- **AsyncStorage**: Local data persistence with encryption for sensitive data

### Development Workflow

- **ESLint + Prettier**: Code formatting and linting with React Native rules
- **Husky**: Git hooks for pre-commit testing and linting
- **Fastlane**: Automated iOS and Android build and deployment
- **CodePush**: Over-the-air updates for JavaScript bundle updates

## Platform-Specific Requirements

### iOS Development

- Xcode latest stable version compatibility
- iOS deployment target minimum version documentation
- App Store Connect integration and submission requirements
- iOS-specific permissions and privacy policy compliance
- TestFlight beta testing integration

### Android Development

- Android Studio and Gradle version compatibility
- Android API level minimum requirements
- Google Play Console integration and submission requirements
- Android-specific permissions and security considerations
- Google Play Internal Testing integration

## Governance

This constitution supersedes all other development practices and must be followed for all React Native projects. All pull requests and code reviews must verify compliance with these principles.

Amendments require:

- Documentation of proposed changes with React Native ecosystem impact analysis
- Team approval with platform-specific testing validation
- Migration plan for existing React Native projects
- Template and tooling updates across development workflow

Complexity must be justified with mobile performance and user experience considerations. Use project-specific guidance files for runtime development decisions while maintaining constitutional compliance.

**Version**: 3.0.0 | **Ratified**: 2025-01-16 | **Last Amended**: 2025-01-16
