document.getElementById("calcBtn").onclick = () => {
    const n1 = parseFloat(document.getElementById("num1").value);
    const n2 = parseFloat(document.getElementById("num2").value);
    const op = document.getElementById("operation").value;
    let result;
    switch(op) {
        case "+": result = n1 + n2; break;
        case "-": result = n1 - n2; break;
        case "*": result = n1 * n2; break;
        case "/": result = n1 / n2; break;
        case "/": result = n2 !== 0 ? (n1 / n2).toFixed(2) : "∞"; break;
        case "%": result = (n1 * n2) / 100; break;
        default: result = "Invalid operation";
    }
    document.getElementById("output").innerText = `=: ${result}`;
};
