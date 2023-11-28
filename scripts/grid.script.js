let rows = 100;
let columns = 26;

function addListenerForAddressBarDisplay(cell, rowId, columnId) {
  cell.addEventListener('click', (_e) => {
    addressBarInput.value = encodeCellLocation(columnId, rowId);
  });
}

for (let i = 0; i < rows; i++) {
  let addressColumn = document.createElement('div');
  addressColumn.classList.add('address-column', 'display-center');
  addressColumn.innerText = i + 1;
  addressColumnContainer.appendChild(addressColumn);
}

for (let i = 0; i < columns; i++) {
  let addressRow = document.createElement('div');
  addressRow.classList.add('address-row', 'display-center');
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRowContainer.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
  let cellRowContainer = document.createElement('div');
  cellRowContainer.classList.add('row-container');
  for (let j = 0; j < columns; j++) {
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

// Attach
let firstCell = document.querySelector('.cell');
firstCell.click();
