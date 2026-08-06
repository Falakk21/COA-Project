const PRECEDENCE = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

const OPERATOR_MAP = {
  '+': 'ADD',
  '-': 'SUB',
  '*': 'MUL',
  '/': 'DIV',
};

function isOperand(token) {
  return /^[A-Z]$/.test(token);
}

function isOperator(token) {
  return Object.prototype.hasOwnProperty.call(PRECEDENCE, token);
}

export function validateExpression(expression) {
  const cleaned = expression.replace(/\s+/g, '');

  if (!cleaned) {
    return { isValid: false, error: 'Please enter an arithmetic expression.', postfix: '' };
  }

  const output = [];
  const stack = [];
  let expectOperand = true;

  for (const token of cleaned) {
    if (isOperand(token)) {
      if (!expectOperand) {
        return { isValid: false, error: `Invalid expression: missing operator before ${token}.`, postfix: '' };
      }
      output.push(token);
      expectOperand = false;
      continue;
    }

    if (token === '(') {
      if (!expectOperand) {
        return { isValid: false, error: 'Invalid expression: missing operator before opening parenthesis.', postfix: '' };
      }
      stack.push(token);
      continue;
    }

    if (token === ')') {
      if (expectOperand) {
        return { isValid: false, error: 'Invalid expression: missing operand before closing parenthesis.', postfix: '' };
      }

      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }

      if (!stack.length) {
        return { isValid: false, error: 'Invalid expression: mismatched parentheses.', postfix: '' };
      }

      stack.pop();
      expectOperand = false;
      continue;
    }

    if (isOperator(token)) {
      if (expectOperand) {
        return { isValid: false, error: `Invalid expression: missing operand before operator ${token}.`, postfix: '' };
      }

      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[token]
      ) {
        output.push(stack.pop());
      }

      stack.push(token);
      expectOperand = true;
      continue;
    }

    return { isValid: false, error: `Invalid expression: unsupported character "${token}".`, postfix: '' };
  }

  if (expectOperand) {
    return { isValid: false, error: 'Invalid expression: expression ended unexpectedly.', postfix: '' };
  }

  while (stack.length) {
    const item = stack.pop();
    if (item === '(') {
      return { isValid: false, error: 'Invalid expression: mismatched parentheses.', postfix: '' };
    }
    output.push(item);
  }

  return { isValid: true, postfix: output.join('') };
}

function generateThreeAddress(postfix) {
  const instructions = [];
  const stack = [];
  let tempCount = 1;

  for (const token of postfix) {
    if (isOperand(token)) {
      stack.push(token);
    } else if (isOperator(token)) {
      const right = stack.pop();
      const left = stack.pop();
      const temp = `T${tempCount}`;
      tempCount += 1;
      instructions.push(`${temp} = ${left} ${token} ${right}`);
      stack.push(temp);
    }
  }

  return { instructions, count: instructions.length };
}

function generateTwoAddress(postfix) {
  const instructions = [];
  const stack = [];
  let registerCount = 1;

  for (const token of postfix) {
    if (isOperand(token)) {
      stack.push(token);
    } else if (isOperator(token)) {
      const right = stack.pop();
      const left = stack.pop();
      const register = `R${registerCount}`;
      registerCount += 1;
      instructions.push(`MOV ${register}, ${left}`);
      instructions.push(`${OPERATOR_MAP[token]} ${register}, ${right}`);
      stack.push(register);
    }
  }

  return { instructions, count: instructions.length };
}

function generateOneAddress(postfix) {
  const instructions = [];
  const stack = [];
  let tempCount = 1;

  for (const token of postfix) {
    if (isOperand(token)) {
      stack.push(token);
    } else if (isOperator(token)) {
      const right = stack.pop();
      const left = stack.pop();
      const temp = `T${tempCount}`;
      tempCount += 1;
      instructions.push(`LOAD ${left}`);
      instructions.push(`${OPERATOR_MAP[token]} ${right}`);
      instructions.push(`STORE ${temp}`);
      stack.push(temp);
    }
  }

  return { instructions, count: instructions.length };
}

function generateZeroAddress(postfix) {
  const instructions = [];
  const stack = [];

  for (const token of postfix) {
    if (isOperand(token)) {
      instructions.push(`PUSH ${token}`);
      stack.push(token);
    } else if (isOperator(token)) {
      const right = stack.pop();
      const left = stack.pop();
      void [right, left];
      instructions.push(OPERATOR_MAP[token]);
      stack.push('TEMP');
    }
  }

  return { instructions, count: instructions.length };
}

export function generateInstructionSets(expression) {
  const validation = validateExpression(expression);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const postfix = validation.postfix;

  const threeAddress = generateThreeAddress(postfix);
  const twoAddress = generateTwoAddress(postfix);
  const oneAddress = generateOneAddress(postfix);
  const zeroAddress = generateZeroAddress(postfix);

  return {
    postfix,
    threeAddress,
    twoAddress,
    oneAddress,
    zeroAddress,
    counts: {
      threeAddress: threeAddress.count,
      twoAddress: twoAddress.count,
      oneAddress: oneAddress.count,
      zeroAddress: zeroAddress.count,
    },
  };
}
