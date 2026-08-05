# COA-Project

A simple Instruction Set Simulator for Computer Organization and Architecture demonstration.

## Features

- Accepts an arithmetic expression containing variables A-Z and operators + - * / ( )
- Validates input and reports common syntax errors
- Converts infix expression to postfix
- Generates equivalent instructions for:
  - Three-address code
  - Two-address code
  - One-address code
  - Zero-address code
- Displays instruction count for each format

## Tech stack

- Frontend: React + Vite
- Backend: C++17 (standalone logic in `backend/iss.cpp`)

## Project structure

- `frontend/` — React app
- `backend/` — C++ logic
- `docs/` — documentation and screenshots

## Setup

### Frontend

```powershell
cd Instruction-Set-Simulator\frontend
npm install
npm run dev
```

### Backend

Compile with a C++17 compiler:

```powershell
cd Instruction-Set-Simulator\backend
g++ -std=c++17 iss.cpp -o iss
```

Then run:

```powershell
./iss
```

On Windows with MSYS2, you can use the provided helper scripts.

From CMD:

```cmd
d:\> cd Instruction-Set-Simulator\backend
D:\Instruction-Set-Simulator\backend> run-backend.cmd "(A+B)*(C-D)/E"
```

From PowerShell:

```powershell
PS C:\> cd Instruction-Set-Simulator\backend
PS C:\Users\bahar\Instruction-Set-Simulator\backend> .\run-backend.ps1 '(A+B)*(C-D)/E'
```

Or run the helper without arguments and enter an expression interactively.
