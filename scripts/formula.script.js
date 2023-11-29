// Formula bar selector
const formulaBar = document.querySelector('.formula-bar');

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    let cell = document.querySelector(`.cell[rowId="${i}"][columnId="${j}"]`);
    cell.addEventListener('blur', (e) => {
      let address = addressBarInput.value;
      let [activeCell, activeCellProps] = getCellAndCellProps(address);
      let enteredData = activeCell.innerText;

      if (enteredData === activeCellProps.value) {
        return;
      }

      activeCellProps.value = enteredData;

      // If data has been modified or updated:
      // 1. Remove parent child relations
      // 2. Update formula to empty
      // 3. Update children with new hardcoded (modified) value
      manipulateChildCellsToParentCell({
        formula: activeCellProps.formula,
        operation: 'remove',
      });
      activeCellProps.formula = '';
      updateChildrenCells(address);
    });
  }
}

formulaBar.addEventListener('keydown', (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === 'Enter' && inputFormula) {
    let address = addressBarInput.value;
    let [cell, cellProps] = getCellAndCellProps(address);

    // If change in formula, evaluate it
    // Break old parent child relation, and add new parent child relation
    if (inputFormula !== cellProps.formula) {
      manipulateChildCellsToParentCell({
        formula: cellProps.formula,
        operation: 'remove',
      });
    }

    // To update UI and cellProp in DB
    let evaluatedValue = evaluateFormula(inputFormula);
    setCellUIAndCellPropFormula(address, evaluatedValue, inputFormula);

    // Establish parent child relationship
    manipulateChildCellsToParentCell({
      formula: inputFormula,
      operation: 'add',
    });

    // Recursively update all the cells based on the parent child relation
    updateChildrenCells(address);
  }
});
