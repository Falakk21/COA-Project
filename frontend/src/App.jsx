import { useState } from 'react';

const isValidChar = (ch) => {
  return /[A-Z+\-*/() ]/.test(ch);
};

const validateExpression = (expr) => {
  if (!expr.trim()) return 'Expression is empty.';

  let balance = 0;
  let prev = null;

  for (let i = 0; i < expr.length; i += 1) {
    const ch = expr[i];
    if (ch === ' ') continue;
    if (!isValidChar(ch)) return `Unsupported character '${ch}'. Use A-Z and + - * / ( ).`;

    if (/[A-Z]/.test(ch)) {
      if (prev === ')') return "Invalid token sequence: operand after ')'.";
    } else if (/[+\-*/]/.test(ch)) {
      if (prev === null || prev === '(' || /[+\-*/]/.test(prev)) {
        return `Invalid operator placement near '${ch}'.`;
      }
    } else if (ch === '(') {
      if (/[A-Z)]/.test(prev)) return "Invalid token sequence before '('.";
      balance += 1;
    } else if (ch === ')') {
      if (prev === null || prev === '(' || /[+\-*/]/.test(prev)) {
        return "Invalid token placement near ')'.";
      }
      balance -= 1;
      if (balance < 0) return 'Mismatched parentheses.';
    }

    if (ch !== ' ') prev = ch;
  }

  if (/[+\-*/]/.test(prev) || prev === '(') {
    return 'Expression ends with an invalid operator or open parenthesis.';
  }
  if (balance !== 0) {
    return 'Mismatched parentheses.';
  }

  return '';
};

const precedence = (op) => {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  return 0;
};

const infixToPostfix = (expr) => {
  const stack = [];
  let output = '';

  for (const ch of expr) {
    if (ch === ' ') continue;
    if (/[A-Z]/.test(ch)) {
      output += ch;
    } else if (ch === '(') {
      stack.push(ch);
    } else if (ch === ')') {
      while (stack.length && stack.at(-1) !== '(') {
        output += stack.pop();
      }
      stack.pop();
    } else {
      while (
        stack.length &&
        /[+\-*/]/.test(stack.at(-1)) &&
        precedence(stack.at(-1)) >= precedence(ch)
      ) {
        output += stack.pop();
      }
      stack.push(ch);
    }
  }

  while (stack.length) {
    output += stack.pop();
  }

  return output;
};

const generateInstructions = (postfix) => {
    const stack = [];
    let tempCount = 0;
    let regCount = 0;

    for (const token of postfix) {
      if (/[A-Z]/.test(token)) {
        stack.push({
          name: token,
          code3: [],
          code2: [],
          code1: [],
          code0: [`PUSH ${token}`],
        });
        continue;
      }

      const right = stack.pop();
      const left = stack.pop();
      tempCount += 1;
      regCount += 1;

      const tempName = `T${tempCount}`;
      const mnemonic = token === '+' ? 'ADD' : token === '-' ? 'SUB' : token === '*' ? 'MUL' : 'DIV';
      const op = token === '+' ? ' + ' : token === '-' ? ' - ' : token === '*' ? ' * ' : ' / ';
      const register = `R${regCount}`;

      const code3 = [...left.code3, ...right.code3, `${tempName} = ${left.name}${op}${right.name}`];
      const code2 = [...left.code2, ...right.code2, `MOV ${register}, ${left.name}`, `${mnemonic} ${register}, ${right.name}`];
      const code1 = [...left.code1, ...right.code1, `LOAD ${left.name}`, `${mnemonic} ${right.name}`, `STORE ${tempName}`];
      const code0 = [...left.code0, ...right.code0, mnemonic];

      stack.push({
        name: tempName,
        code3,
        code2,
        code1,
        code0,
      });
    }

    if (stack.length) {
      const entry = stack.at(-1);
      return {
        postfix,
        threeAddress: entry.code3,
        twoAddress: entry.code2,
        oneAddress: [...entry.code1, `STORE RESULT`],
    };
  }

  return { postfix, threeAddress: [], twoAddress: [], oneAddress: [], zeroAddress: [] };
};

function App() {
  const [expression, setExpression] = useState('');
  const [postfix, setPostfix] = useState('');
  const [threeAddress, setThreeAddress] = useState([]);
  const [twoAddress, setTwoAddress] = useState([]);
  const [oneAddress, setOneAddress] = useState([]);
  const [zeroAddress, setZeroAddress] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const cleanExpression = expression.trim();
    const validation = validateExpression(cleanExpression);
    if (validation) {
      setError(validation);
      setPostfix('');
      setThreeAddress([]);
      setTwoAddress([]);
      setOneAddress([]);
      setZeroAddress([]);
      return;
    }

    setError('');
    const postfixExpr = infixToPostfix(cleanExpression);
    const instructions = generateInstructions(postfixExpr);
    setPostfix(postfixExpr);
    setThreeAddress(instructions.threeAddress);
    setTwoAddress(instructions.twoAddress);
    setOneAddress(instructions.oneAddress);
    setZeroAddress(instructions.zeroAddress);
  };

  const handleClear = () => {
    setExpression('');
    setPostfix('');
    setThreeAddress([]);
    setTwoAddress([]);
    setOneAddress([]);
    setZeroAddress([]);
    setError('');
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Instruction Set Simulator</h1>
      </header>

      <section className="input-panel">
        <label htmlFor="expression">Expression</label>
        <input
          id="expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value.toUpperCase())}
          placeholder="(A+B)*(C-D)/E"
          aria-label="Expression input"
        />
        <div className="actions">
          <button onClick={handleGenerate}>Generate</button>
          <button className="secondary" onClick={handleClear}>Clear</button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>

      <section className="result-panel">
        <div className="card">
          <h2>Postfix</h2>
          <pre>{postfix}</pre>
        </div>

        <div className="card">
          <h2>Three Address Code</h2>
          <pre>{threeAddress.join('\n')}</pre>
          <div className="count">Instruction Count: {threeAddress.length}</div>
        </div>

        <div className="card">
          <h2>Two Address Code</h2>
          <pre>{twoAddress.join('\n')}</pre>
          <div className="count">Instruction Count: {twoAddress.length}</div>
        </div>

        <div className="card">
          <h2>One Address Code</h2>
          <pre>{oneAddress.join('\n')}</pre>
          <div className="count">Instruction Count: {oneAddress.length}</div>
        </div>

        <div className="card">
          <h2>Zero Address Code</h2>
          <pre>{zeroAddress.join('\n')}</pre>
          <div className="count">Instruction Count: {zeroAddress.length}</div>
        </div>
      </section>
    </div>
  );
}

export default App;
