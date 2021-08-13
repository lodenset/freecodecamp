import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import PointTarget from "react-point";

const CalculatorKey = ({ onPress, className, ...props }) => {
  return (
    <PointTarget onPoint={onPress}>
      <button className={`calculator-key ${className}`} {...props} />
    </PointTarget>
  );
};

const AutoScalingText = (props) => {
  const node = useRef();
  const [scale, SetScale] = useState(1);
  useEffect(() => {
    const parentNode = node.current.parentNode;

    const availableWidth = parentNode.offsetWidth;
    const actualWidth = node.offsetWidth;
    const actualScale = availableWidth / actualWidth;

    if (scale === actualScale) return;

    if (actualScale < 1) {
      SetScale(actualScale);
    } else if (scale < 1) {
      SetScale(1);
    }
  }, [scale]);

  return (
    <div
      className="auto-scaling-text"
      style={{ transform: `scale(${scale},${scale})` }}
      ref={node}
    >
      {props.children}
    </div>
  );
};

const CalculatorDisplay = ({ value, ...props }) => {
  const language = navigator.language || "en-US";

  let formattedValue = parseFloat(value).toLocaleString(language, {
    useGrouping: true,
    maximumFractionDigits: 6,
  });

  // Add back missing .0 in e.g. 12.0
  const match = value.match(/\.\d*?(0*)$/);

  if (match) {
    formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];
  }

  return (
    <div {...props} className="calculator-display" id="display">
      <AutoScalingText>{formattedValue}</AutoScalingText>
    </div>
  );
};

const CalculatorOperations = {
  "/": (prevValue, nextValue) => prevValue / nextValue,
  "*": (prevValue, nextValue) => prevValue * nextValue,
  "+": (prevValue, nextValue) => prevValue + nextValue,
  "-": (prevValue, nextValue) => prevValue - nextValue,
  "=": (prevValue, nextValue) => nextValue,
};

function App() {
  const [val, SetVal] = useState(null);
  const [displayValue, SetDisplayValue] = useState("0");
  const [operator, SetOperator] = useState(null);
  const [waitingForOperand, SetWaitingForOperand] = useState(false);
  const [negOperator, SetNegOperator] = useState(false);

  function clearAll() {
    SetVal(null);
    SetDisplayValue("0");
    SetOperator(null);
    SetWaitingForOperand(false);
    SetNegOperator(false);
  }

  function clearDisplay() {
    SetDisplayValue("0");
  }

  function clearLastChar() {
    SetDisplayValue(displayValue.substring(0, displayValue.length - 1) || "0");
  }

  function toggleSign() {
    const newValue = parseFloat(displayValue) * -1;
    SetDisplayValue(String(newValue));
  }

  function inputPercent() {
    const currentValue = parseFloat(displayValue);

    if (currentValue === 0) return;

    const fixedDigits = displayValue.replace(/^-?\d*\.?/, "");
    const newValue = parseFloat(displayValue) / 100;
    SetDisplayValue(String(newValue.toFixed(fixedDigits.length + 2)));
  }

  function inputDot() {
    if (!/\./.test(displayValue)) {
      SetDisplayValue(displayValue + ".");
      SetWaitingForOperand(false);
    }
  }

  function inputDigit(digit) {
    if (waitingForOperand) {
      SetDisplayValue(String(digit));
      SetWaitingForOperand(false);
    } else {
      SetDisplayValue(
        displayValue === "0" ? String(digit) : displayValue + digit
      );
    }
  }

  function performOperation(nextOperator) {
    if (waitingForOperand && nextOperator !== "-") {
      SetOperator(nextOperator);
      SetNegOperator(false);
      return;
    }

    if (waitingForOperand && nextOperator === "-") {
      SetNegOperator(true);
      return;
    }

    let inputValue = parseFloat(displayValue);

    if (negOperator) {
      inputValue = inputValue * -1;
      SetNegOperator(false);
    }

    if (val == null) {
      SetVal(inputValue);
    } else if (operator) {
      const currentValue = val || 0;
      const newValue = CalculatorOperations[operator](currentValue, inputValue);

      SetVal(newValue);
      SetDisplayValue(String(newValue));
    }

    SetWaitingForOperand(true);
    SetOperator(nextOperator);
  }

  function handleKeyDown(event) {
    let { key } = event;

    if (key === "Enter") key = "=";

    if (/\d/.test(key)) {
      event.preventDefault();
      inputDigit(parseInt(key, 10));
    } else if (key in CalculatorOperations) {
      event.preventDefault();
      performOperation(key);
    } else if (key === ".") {
      event.preventDefault();
      inputDot();
    } else if (key === "%") {
      event.preventDefault();
      inputPercent();
    } else if (key === "Backspace") {
      event.preventDefault();
      clearLastChar();
    } else if (key === "Clear") {
      event.preventDefault();

      if (displayValue !== "0") {
        clearDisplay();
      } else {
        clearAll();
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="container">
      <div className="calculator">
        <CalculatorDisplay value={displayValue} />
        <div className="calculator-keypad">
          <div className="input-keys">
            <div className="function-keys">
              <CalculatorKey
                className="key-clear"
                id="clear"
                onPress={() => (clearDisplay() ? clearDisplay() : clearAll())}
              >
                AC
              </CalculatorKey>
              <CalculatorKey className="key-sign" onPress={() => toggleSign()}>
                ±
              </CalculatorKey>
              <CalculatorKey
                className="key-percent"
                onPress={() => inputPercent()}
              >
                %
              </CalculatorKey>
            </div>
            <div className="digit-keys">
              <CalculatorKey
                className="key-0"
                id="zero"
                onPress={() => inputDigit(0)}
              >
                0
              </CalculatorKey>
              <CalculatorKey
                className="key-dot"
                id="decimal"
                onPress={() => inputDot()}
              >
                .
              </CalculatorKey>
              <CalculatorKey
                className="key-1"
                id="one"
                onPress={() => inputDigit(1)}
              >
                1
              </CalculatorKey>
              <CalculatorKey
                className="key-2"
                id="two"
                onPress={() => inputDigit(2)}
              >
                2
              </CalculatorKey>
              <CalculatorKey
                className="key-3"
                id="three"
                onPress={() => inputDigit(3)}
              >
                3
              </CalculatorKey>
              <CalculatorKey
                className="key-4"
                id="four"
                onPress={() => inputDigit(4)}
              >
                4
              </CalculatorKey>
              <CalculatorKey
                className="key-5"
                id="five"
                onPress={() => inputDigit(5)}
              >
                5
              </CalculatorKey>
              <CalculatorKey
                className="key-6"
                id="six"
                onPress={() => inputDigit(6)}
              >
                6
              </CalculatorKey>
              <CalculatorKey
                className="key-7"
                id="seven"
                onPress={() => inputDigit(7)}
              >
                7
              </CalculatorKey>
              <CalculatorKey
                className="key-8"
                id="eight"
                onPress={() => inputDigit(8)}
              >
                8
              </CalculatorKey>
              <CalculatorKey
                className="key-9"
                id="nine"
                onPress={() => inputDigit(9)}
              >
                9
              </CalculatorKey>
            </div>
          </div>
          <div className="operator-keys">
            <CalculatorKey
              className="key-divide"
              id="divide"
              onPress={() => performOperation("/")}
            >
              ÷
            </CalculatorKey>
            <CalculatorKey
              className="key-multiply"
              id="multiply"
              onPress={() => performOperation("*")}
            >
              ×
            </CalculatorKey>
            <CalculatorKey
              className="key-subtract"
              id="subtract"
              onPress={() => performOperation("-")}
            >
              −
            </CalculatorKey>
            <CalculatorKey
              className="key-add"
              id="add"
              onPress={() => performOperation("+")}
            >
              +
            </CalculatorKey>
            <CalculatorKey
              className="key-equals"
              id="equals"
              onPress={() => performOperation("=")}
            >
              =
            </CalculatorKey>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
