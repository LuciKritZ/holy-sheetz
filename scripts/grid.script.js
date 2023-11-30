// Default number of rows and columns
let DEFAULT_ROWS_COUNT = 100;
let DEFAULT_COLUMNS_COUNT = 26;

const addressColumnContainer = document.querySelector('.address-col-container');
const addressRowContainer = document.querySelector('.address-row-container');
const cellsContainer = document.querySelector('.cells-container');
let addressBarInput = document.querySelector('.address-bar');

/**
 * @function addListenerForAddressBarDisplay
 * Adds click listener to link the address bar with the correct rowId and columnId of each cell.
 * @param {HTMLElement} cell
 * @param {integer} rowId
 * @param {integer} columnId
 * @returns {null}
 */
function addListenerForAddressBarDisplay(cell, rowId, columnId) {
  cell.addEventListener('click', (_e) => {
    addressBarInput.value = encodeCellLocation(columnId, rowId);
  });
}

// For showing the rows (1 -> 100)
for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
  let addressColumn = document.createElement('div');
  addressColumn.classList.add('address-column', 'display-center');
  addressColumn.innerText = i + 1;
  addressColumnContainer.appendChild(addressColumn);
}

// For showing the columns (A -> Z)
for (let i = 0; i < DEFAULT_COLUMNS_COUNT; i++) {
  let addressRow = document.createElement('div');
  addressRow.classList.add('address-row', 'display-center');
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRowContainer.appendChild(addressRow);
}

// For creating the cells for sheet.
for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
  let cellRowContainer = document.createElement('div');
  cellRowContainer.classList.add('row-container');
  for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
    let cell = document.createElement('div');
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('rowId', i);
    cell.setAttribute('columnId', j);
    cell.setAttribute('spellcheck', false);
    cell.classList.add('cell');
    cellRowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell, i, j);
  }
  cellsContainer.appendChild(cellRowContainer);
}

// Attach first cell to the address bar on page load
const firstCell = document.querySelector('.cell');
firstCell.click();
