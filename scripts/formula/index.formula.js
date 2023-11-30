// Formula bar selector
const formulaBar = document.querySelector('.formula-bar');

for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
  for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
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

formulaBar.addEventListener('keydown', async (e) => {
  let inputFormula = formulaBar.value;

  // When user decides to enter the formula
  if (e.key === 'Enter' && inputFormula) {
    let address = addressBarInput.value;
    let [_cell, cellProps] = getCellAndCellProps(address);

    // If change in formula, evaluate it
    // Break old parent child relation, and add new parent child relation
    if (inputFormula !== cellProps.formula) {
      manipulateChildCellsToParentCell({
        formula: cellProps.formula,
        operation: 'remove',
      });
    }

    addOrRemoveChildInGraphMatrix({
      formula: inputFormula,
      childAddress: address,
      operation: 'add',
    });

    // Check whether the formula is cyclic or not, only then proceed.
    let cyclicLocation = isGraphCyclic(graphComponentMatrix);

    /**
     * If graph is cyclic:
     * 1. Send an alert
     * 2. Break the relations made by addChildToGraphComponent
     */
    if (cyclicLocation) {
      // alert('Cyclic formula detected');
      let shouldShowTrace = confirm(
        'Cyclic formula detected, do you wish to trace your cells path?'
      );

      while (shouldShowTrace) {
        await getGraphCyclicTracePath(graphComponentMatrix, cyclicLocation);
        // Stack tracing will continue until user decides to opt out.
        shouldShowTrace = confirm(
          'Cyclic formula detected, do you wish to trace your stack path?'
        );
      }

      addOrRemoveChildInGraphMatrix({
        formula: inputFormula,
        childAddress: address,
        operation: 'remove',
      });
      return;
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
