# Business Execution System Frontend

This is the React-based monorepo for the **BES (Business Execution System)** platform, built using [Nx](https://nx.dev).

## 🏗️ Architecture

The frontend is designed to be highly modular, using a **Shell-and-Module** pattern.

### Applications (`apps/`)
- **`shell`**: The main entry point. Handles authentication, navigation, and dynamically renders modules based on the user's licensed features and permissions.
- **`showcase`**: A developer-focused app for browsing and testing shared UI components in isolation.

### Libraries (`libs/`)
- **`shared-ui`**: The design system. Contains core components, design tokens (Vanilla CSS), and the `ComponentRegistry`.
- **`finance`**: UI module for Financial management (GL, COA, etc.).
- **`sales`**: UI module for Sales and Quoting.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Shell App
```bash
npm run dev
```
The app will be available at [http://localhost:4200](http://localhost:4200).

### 3. Run the Component Showcase
```bash
npm run showcase
```
Browse all available components at [http://localhost:4201](http://localhost:4201).

---

## 🛠️ Development Workflow

### Adding a New Module
Use the following Nx command to generate a new library for a module:
```bash
npx nx g @nx/react:lib <module-name>
```

### Component Registration
Each module library must self-register its components in the shell via the `ComponentRegistry` in its `index.ts`.

### Styling
We use **Vanilla CSS** with design tokens. Avoid adding ad-hoc styles; use the tokens defined in `@bes/shared-ui`.

---

## 📜 Coding Rules
All frontend code MUST comply with the **[Frontend Coding Rules](../.gemini/rules/frontend.md)**.
