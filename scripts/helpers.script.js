const ACTIVE_COLOR_PROPERTY = '#d1d8e0';
const INACTIVE_COLOR_PROPERTY = '#ecf0f1';

/**
 * encodeCellLocation
 * Encodes cell location in columnIdRowId format.
 * Eg: 0,0 -> A1
 * @param {integer} columnId
 * @param {integer} rowId
 * @returns {string}
 */
function encodeCellLocation(columnId, rowId) {
  return `${String.fromCharCode(65 + columnId)}${rowId + 1}`;
}

/**
 * decodeCellLocation
 * Decodes rowId and columnId from a cell location.
 * Eg: A1 -> [0,0]
 * @param {string} encodedCell
 * @returns {array}
 */
function decodeCellLocation(encodedCell) {
  return [
    Number(encodedCell.slice(1) - 1),
    Number(encodedCell.charCodeAt(0)) - 65,
  ];
}

/**
 * getCellAndCellProps
 * Returns the cell and cell properties on the basis of provided address.
 * @param {string} address
 * @returns {array}
 */
function getCellAndCellProps(address) {
  const [rowId, colId] = decodeCellLocation(address);
  let cell = document.querySelector(
    `.cell[rowId="${rowId}"][columnId="${colId}"]`
  );
  let cellProp = sheetDB[rowId][colId];
  return [cell, cellProp];
}

// Helper functions for formula

/**
 * evaluateFormula
 * Evaluates the formula provided by the user in formula bar by using eval.
 * @param {string} formula
 * @returns {string}
 */
function evaluateFormula(formula) {
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [_cell, cellProp] = getCellAndCellProps(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(' ');
  return eval(decodedFormula);
}

/**
 * setCellUIAndCellPropFormula
 * Synchronizes the properties of the cell in UI as well as the storage.
 * @param {string} address
 * @param {string} evaluatedValue
 * @param {string} formula
 * @returns {null}
 */
function setCellUIAndCellPropFormula(address, evaluatedValue, formula) {
  let [activeCell, activeCellProps] = getCellAndCellProps(address);

  // UI Formula
  activeCell.innerText = evaluatedValue;

  // DB Update
  activeCellProps.value = evaluatedValue;
  activeCellProps.formula = formula;
}

/**
 * manipulateChildCellsToParentCell
 * Performs addition or removal of child cells to their respective parent cells.
 * @param {string} manipulateChildCellsToParentCell.formula
 * @param {string} manipulateChildCellsToParentCell.operation
 * @returns {null}
 */
function manipulateChildCellsToParentCell({ formula, operation = 'add' }) {
  const childAddress = addressBarInput.value;
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    if (asciiValue >= 65 && asciiValue <= 90) {
      let [_parentCell, parentCellProp] = getCellAndCellProps(
        encodedFormula[i]
      );
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

/**
 * updateChildrenCells
 * A recursive function to update the children cells to their parent cells based on their formula provided by the user.
 * @param {string} parentAddress
 * @returns {null}
 */
function updateChildrenCells(parentAddress) {
  let [_parentCell, parentCellProps] = getCellAndCellProps(parentAddress);
  let children = parentCellProps.children;

  // Base case
  for (i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [_childCell, childCellProps] = getCellAndCellProps(childAddress);
    let childFormula = childCellProps.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellPropFormula(childAddress, evaluatedValue, childFormula);

    // Recursively updating values
    updateChildrenCells(childAddress);
  }
}
