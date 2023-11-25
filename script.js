let rows = 100;
let columns = 26;

let addressColumnContainer = document.querySelector('.address-col-container');
let addressRowContainer = document.querySelector('.address-row-container');
let cellsContainer = document.querySelector('.cells-container');
let addressBarInput = document.querySelector('.address-bar');

function addListenerForAddressBarDisplay(cell, rowId, columnId) {
  cell.addEventListener('click', (e) => {
    rowId = rowId + 1;
    columnId = String.fromCharCode(65 + columnId);
    addressBarInput.value = `${columnId}:${rowId}`;
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
    cell.classList.add('cell');
    cellRowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell, i, j);
  }
  cellsContainer.appendChild(cellRowContainer);
}
