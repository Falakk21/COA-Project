# Instruction Set Simulator

A React + Vite web app that demonstrates how arithmetic expressions can be translated into four CPU instruction formats:

- Three-address code
- Two-address code
- One-address code
- Zero-address code

## Features

- Validates arithmetic expressions
- Supports uppercase variables A-Z
- Respects operator precedence
- Displays postfix form alongside each instruction set
- Shows the instruction count for each format

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite in your browser.

## Build

```bash
npm run build
```

## Example

Input:

```text
(A+B)*(C-D)/E
```

The app will generate postfix and instruction sequences for all four formats.
