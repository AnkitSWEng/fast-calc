import { calculate } from './calc.js';

let firstNumber = null;
let popup = null;
let lastResult = null;

/**
 * Listen for text selection on the webpage.
 */
document.addEventListener("mouseup", (e) => {
  // Ignore selections inside the popup
  if (popup && popup.contains(e.target)) return;

  const raw = window.getSelection().toString().trim();
  const clean = raw.replace(/[^0-9.\-]/g, '');
  if (!isNaN(clean) && clean !== "") {
    const selected = parseFloat(clean);
    if (firstNumber === null) {
      firstNumber = selected;
      createPopup(e, selected);
    } else {
      const secondField = document.getElementById("secondNum");
      if (secondField) {
        secondField.value = selected;
      }
    }
  }
});

/**
 * Creates and renders the popup UI.
 */
function createPopup(e, num) {
  if (popup) popup.remove(); // Remove any existing

  popup = document.createElement("div");
  popup.id = "fast-calc-popup";
  popup.style = `
    position: fixed;
    top: ${e.clientY + 10}px;
    left: ${e.clientX + 10}px;
    z-index: 99999;
    opacity: 0.9;
    font-family: sans-serif;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
  `;

  popup.innerHTML = `
    <div id="popup-header" style="
      background:#eee;
      padding:9px;
      cursor:move;
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-weight:bold;
      border-bottom:2px solid #ccc;
    ">
      <span>Fast Calc</span>
      <span id="closePopup" style="cursor:pointer;font-size:18px;">&times;</span>
    </div>
    <div style="display: flex; padding: 9px;">
      <div style="flex: 1;">
        <div>X: <input type="text" id="firstNum" value="${num}" style="width: 90px;" /></div>
        <div>Y: <input type="text" id="secondNum" placeholder="select or type" style="width: 90px;" /></div>
        <div id="res" style="margin-top:9px;font-weight:bold;"></div>
        <div style="margin-top:10px; display:flex; gap:6px;">
          <button id="clearFields">Clear</button>
          <button id="useLastResult">Use Last Result</button>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; margin-left: 10px; gap: 5px;">
        <button class="op-btn" data-op="+" style="padding: 6px;">+</button>
        <button class="op-btn" data-op="-" style="padding: 6px;">−</button>
        <button class="op-btn" data-op="*" style="padding: 6px;">×</button>
        <button class="op-btn" data-op="/" style="padding: 6px;">÷</button>
        <button class="op-btn" data-op="%" style="padding: 6px;">%</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  enableDragging();
  attachOpHandler();
  setupClearHandler();
  setupCloseHandler();
  setupEnterKey();
  setupUseLastResult();
}

/**
 * Add calculation logic on button click.
 */
function attachOpHandler() {
  const resDiv = document.getElementById("res");
  const buttons = document.querySelectorAll(".op-btn");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      // Reset styling for all
      buttons.forEach(b => b.style.background = "");
      btn.style.background = "#cde"; // Mark active

      const op = btn.dataset.op;
      const firstVal = parseFloat(document.getElementById("firstNum").value.replace(/,/g, ''));
      const secondVal = parseFloat(document.getElementById("secondNum").value.replace(/,/g, ''));

      if (isNaN(firstVal) || isNaN(secondVal)) {
        resDiv.innerText = "Invalid input.";
        return;
      }

      let result;

      try {
      result = calculate(firstVal, secondVal, op);
      resDiv.innerText = "=: " + result;
      lastResult = result;
      } catch (err) {
      resDiv.innerText = "Error: " + err.message;
      }

      

      lastResult = result; // Save memory
      resDiv.innerText = "=: " + result;
    };
  });
}

/**
 * Allow popup to be draggable.
 */
function enableDragging() {
  const header = document.getElementById("popup-header");
  let isDragging = false, offsetX = 0, offsetY = 0;

  header.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    document.body.style.userSelect = "none";
  };

  document.onmousemove = (e) => {
    if (isDragging) {
      popup.style.left = `${e.clientX - offsetX}px`;
      popup.style.top = `${e.clientY - offsetY}px`;
    }
  };

  document.onmouseup = () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  };
}

/**
 * Handle ESC key to close the popup.
 */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup) {
    popup.remove();
    popup = null;
    firstNumber = null;
  }
});

/**
 * Clear all field values.
 */
function setupClearHandler() {
  const clearBtn = document.getElementById("clearFields");
  if (!clearBtn) return;
  clearBtn.onclick = () => {
    firstNumber = null;
    document.getElementById("firstNum").value = "";
    document.getElementById("secondNum").value = "";
    document.getElementById("res").innerText = "";
    document.querySelectorAll(".op-btn").forEach(b => b.style.background = "");
  };
}

/**
 * Close popup on clicking (x).
 */
function setupCloseHandler() {
  const closeBtn = document.getElementById("closePopup");
  if (!closeBtn) return;
  closeBtn.onclick = () => {
    popup.remove();
    popup = null;
    firstNumber = null;
  };
}

/**
 * Use last calculated result in second field.
 */
function setupUseLastResult() {
  const useBtn = document.getElementById("useLastResult");
  if (!useBtn) return;
  useBtn.onclick = () => {
    if (lastResult !== null) {
      document.getElementById("secondNum").value = lastResult;
    }
  };
}

/**
 * Pressing Enter triggers the selected operation.
 */
function setupEnterKey() {
  const firstInput = document.getElementById("firstNum");
  const secondInput = document.getElementById("secondNum");
  const buttons = document.querySelectorAll(".op-btn");

  const triggerActiveOp = () => {
    for (const btn of buttons) {
      if (btn.style.background) {
        btn.click(); // reuse handler
        break;
      }
    }
  };

  [firstInput, secondInput].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        triggerActiveOp();
      }
    });
  });
}
