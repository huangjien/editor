# Project Rules – React Native

## 🎨 Code Style
- Use **TypeScript** (`.tsx` / `.ts`) for all new files.
- Follow **Airbnb React style guide** as baseline.
- Use **functional components** + **React Hooks**; avoid class components.
- Always type props with `Props` interface and state with `State` type.
- Use **camelCase** for variables/functions, **PascalCase** for components.
- Keep components ≤ 300 lines; extract UI/logic into smaller modules.
- Format code with **Prettier** (2-space indent).
- Use **ESLint** with React + React Native + TypeScript plugins.
- Avoid inline styles → use **StyleSheet** or **TailwindCSS (NativeWind)**.

## 📦 Dependencies
- Package manager: **pnpm** (preferred) or `yarn`.
- Lockfile must be committed (`pnpm-lock.yaml`).
- Keep dependencies updated (`pnpm update`).
- Avoid unmaintained libraries — prefer **Expo ecosystem** when possible.
- Shared UI should use **shadcn/ui for React Native** if compatible, else custom components.

## 🧪 Testing
- Use **Jest** for unit tests and snapshot tests.
- Use **React Native Testing Library (RNTL)** for component tests.
- Place tests alongside components:  
  - `ComponentName.test.tsx`  
- Minimum coverage: **70%**.
- Run tests with:
  ```bash
  pnpm test
