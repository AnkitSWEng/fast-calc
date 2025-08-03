// calc.js
export function calculate(a, b, operator) {
  switch (operator) {
    case '+': return a + b; break;  
    case '-': return a - b; break; 
    case '*': return a * b; break; 
    case '/': return b !== 0 ? parseFloat((a / b).toFixed(2)) : Infinity; break; 
    case '%': return (a * b) / 100; break; 
    default: throw new Error("Invalid operator");
  }
}
