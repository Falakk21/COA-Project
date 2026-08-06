import { useMemo, useState } from 'react';
import { generateInstructionSets, validateExpression } from './utils/iss';

function App() {
  const [expression, setExpression] = useState('(A+B)*(C-D)/E');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleGenerate = () => {
    const validation = validateExpression(expression);
    if (!validation.isValid) {
      setResults(null);
      setError(validation.error);
      return;
    }

    try {
      const generated = generateInstructionSets(expression);
      setResults(generated);
      setError('');
    } catch (err) {
      setResults(null);
      setError(err.message || 'Unable to generate instructions.');
    }
  };

  const handleClear = () => {
    setExpression('');
    setResults(null);
    setError('');
  };

  const exampleExpressions = useMemo(
    () => ['(A+B)*(C-D)/E', 'A+B*C', '((A+B)*(C-D))'],
    []
  );

  return (
    <div className="app-shell">
      <div className="card">
        <div className="hero">
          <p className="eyebrow">Computer Organization &amp; Architecture</p>
          <h1>Instruction Set Simulator</h1>
          <p className="subtitle">
            Convert arithmetic expressions into three, two, one, and zero address instruction formats.
          </p>
        </div>

        <div className="controls">
          <label htmlFor="expression" className="input-label">
            Expression
          </label>
          <input
            id="expression"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder="Enter an expression such as (A+B)*(C-D)/E"
          />

          <div className="button-row">
            <button type="button" onClick={handleGenerate}>
              Generate
            </button>
            <button type="button" className="secondary" onClick={handleClear}>
              Clear
            </button>
          </div>

          <div className="examples">
            <span>Try:</span>
            {exampleExpressions.map((item) => (
              <button key={item} type="button" className="chip" onClick={() => setExpression(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {error ? <div className="error-box">{error}</div> : null}

        {results ? (
          <div className="results-grid">
            <section className="panel">
              <h2>Postfix</h2>
              <pre>{results.postfix}</pre>
            </section>

            <section className="panel">
              <h2>Three Address Code</h2>
              {results.threeAddress.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`}>{instruction}</div>
              ))}
              <p className="count">Instruction Count: {results.threeAddress.count}</p>
            </section>

            <section className="panel">
              <h2>Two Address Code</h2>
              {results.twoAddress.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`}>{instruction}</div>
              ))}
              <p className="count">Instruction Count: {results.twoAddress.count}</p>
            </section>

            <section className="panel">
              <h2>One Address Code</h2>
              {results.oneAddress.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`}>{instruction}</div>
              ))}
              <p className="count">Instruction Count: {results.oneAddress.count}</p>
            </section>

            <section className="panel">
              <h2>Zero Address Code</h2>
              {results.zeroAddress.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`}>{instruction}</div>
              ))}
              <p className="count">Instruction Count: {results.zeroAddress.count}</p>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
