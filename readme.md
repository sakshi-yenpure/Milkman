# TheirMilkman – Run Guides

This repository contains multiple apps. These instructions cover running the React admin frontend and the Node/Express backend.

## Prerequisites

- Node.js 18+ and npm

## Backend (Express)

- Directory: `backend/`
- Default URL: http://localhost:3000/

Commands:

```bash
cd backend
npm install
npm start
```

## React Admin (Vite + React)

- Directory: `reactadmin/`
- Dev server default URL: http://localhost:5173/

Commands:

```bash
cd reactadmin
npm install
npm run dev
```

If port 5173 is busy, specify another port:

```bash
npm run dev -- --port 5174 --strictPort
```

### Preview production build (optional)

```bash
cd reactadmin
npm install
npm run build
npm run preview -- --port 5174 --strictPort
```

## Notes

- Run each app in a separate terminal.
- Ensure ports are free or use the `--port` flag to choose a different one.

