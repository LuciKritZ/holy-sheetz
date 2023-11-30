let activeColorProp = '#d1d8e0';
let inactiveColorProp = '#ecf0f1';

function encodeCellLocation(columnId, rowId) {
  return `${String.fromCharCode(65 + columnId)}${rowId + 1}`;
}

function decodeCellLocation(encodedCell) {
  return [
    Number(encodedCell.slice(1) - 1),
    Number(encodedCell.charCodeAt(0)) - 65,
  ];
}

function getCellAndCellProps(address) {
  const [rowId, colId] = decodeCellLocation(address);
  let cell = document.querySelector(
    `.cell[rowId="${rowId}"][columnId="${colId}"]`
  );
  let cellProp = sheetDB[rowId][colId];
  return [cell, cellProp];
}

// Formula Helper functions
function evaluateFormula(formula) {
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProps(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(' ');
  return eval(decodedFormula);
}

function setCellUIAndCellPropFormula(address, evaluatedValue, formula) {
  let [activeCell, activeCellProps] = getCellAndCellProps(address);

  // UI Formula
  activeCell.innerText = evaluatedValue;

  // DB Update
  activeCellProps.value = evaluatedValue;
  activeCellProps.formula = formula;
}

function manipulateChildCellsToParentCell({ formula, operation = 'add' }) {
  const childAddress = addressBarInput.value;
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProps(encodedFormula[i]);
      switch (operation) {
        case 'add': {
          parentCellProp.children.push(childAddress);
          break;
        }
        case 'remove': {
          let idx = parentCellProp.children.indexOf(childAddress);
          parentCellProp.children.splice(idx, 1);
        }
        default:
          break;
      }
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProps] = getCellAndCellProps(parentAddress);
  let children = parentCellProps.children;

  // Base case
  for (i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProps] = getCellAndCellProps(childAddress);
    let childFormula = childCellProps.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellPropFormula(childAddress, evaluatedValue, childFormula);

    // Recursively updating values
    updateChildrenCells(childAddress);
  }
}
