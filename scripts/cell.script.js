// Cell properties selectors
const bold = document.querySelector('.font-bold');
const italics = document.querySelector('.font-italics');
const underline = document.querySelector('.font-underline');
const fontSize = document.querySelector('.font-size-properties');
const fontFamily = document.querySelector('.font-family-properties');
const color = document.querySelector('.font-color-property');
const bgColor = document.querySelector('.bg-color-property');
const alignment = document.querySelectorAll('.text-alignment');
const [leftAlign, centerAlign, rightAlign] = alignment;

// Storage for mapping the required data of every cell
let sheetDB = [];

for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
  let sheetRow = [];
  for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
    let sheetColumn = {
      bold: false,
      italics: false,
      underline: false,
      alignment: 'left',
      fontFamily: 'monospace',
      fontSize: 14,
      color: '#000000',
      bgColor: '#000000',
      value: '',
      formula: '',
      children: [],
    };
    sheetRow.push(sheetColumn);
  }

  sheetDB.push(sheetRow);
}

// Two way Bindings
// Bold property
bold.addEventListener('click', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal';
  bold.style.backgroundColor = cellProp.bold
    ? ACTIVE_COLOR_PROPERTY
    : INACTIVE_COLOR_PROPERTY;
  cell.focus();
});

// Italics property
italics.addEventListener('click', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.italics = !cellProp.italics;
  cell.style.fontStyle = cellProp.italics ? 'italic' : 'normal';
  italics.style.backgroundColor = cellProp.italics
    ? ACTIVE_COLOR_PROPERTY
    : INACTIVE_COLOR_PROPERTY;
  cell.focus();
});

// Underline property
underline.addEventListener('click', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? 'underline' : 'none';
  underline.style.backgroundColor = cellProp.underline
    ? ACTIVE_COLOR_PROPERTY
    : INACTIVE_COLOR_PROPERTY;
  cell.focus();
});

// Font size property
fontSize.addEventListener('change', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = cellProp.fontSize + 'px';
  fontSize.value = cellProp.fontSize;
  cell.focus();
});

// Font family property
fontFamily.addEventListener('change', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
  cell.focus();
});

// Font color
color.addEventListener('change', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.color = color.value;
  cell.style.color = cellProp.color;
  color.value = cellProp.color;
  cell.focus();
});

// background color
bgColor.addEventListener('change', (_e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.bgColor = bgColor.value;
  cell.style.backgroundColor = cellProp.bgColor;
  bgColor.value = cellProp.bgColor;
  cell.focus();
});

// Alignment
alignment.forEach((alignmentElement) => {
  alignmentElement.addEventListener('click', (_e) => {
    let address = addressBarInput.value;
    let [cell, cellProp] = getCellAndCellProps(address);

    let alignmentValue = _e.target.classList[0];
    cellProp.alignment = alignmentValue;
    cell.style.textAlign = cellProp.alignment;

    switch (alignmentValue) {
      case 'left':
        leftAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        break;
      case 'center':
        leftAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        break;
      case 'right':
        leftAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        break;
      default:
        break;
    }
    cell.focus();
  });
});

let allCells = document.querySelectorAll('.cell');

// Adding event listener to sync storageDB and UI
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

/**
 * addListenerToAttachCellProperties
 * Adds click listener to perform the two way binding between the database and the UI.
 * @param {HTMLElement} cell
 * @returns {null}
 */
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener('click', (_e) => {
    let address = addressBarInput.value;
    let [rowId, columnId] = decodeCellLocation(address);
    let cellProp = sheetDB[rowId][columnId];

    // apply cell properties
    cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal';
    cell.style.fontStyle = cellProp.italics ? 'italic' : 'normal';
    cell.style.textDecoration = cellProp.underline ? 'underline' : 'none';
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.color;
    cell.style.backgroundColor =
      cellProp.bgColor === '#000000' ? 'transparent' : cellProp.bgColor;
    cell.style.textAlign = cellProp.alignment;

    // Apply UI properties to container properties
    bold.style.backgroundColor = cellProp.bold
      ? ACTIVE_COLOR_PROPERTY
      : INACTIVE_COLOR_PROPERTY;
    italics.style.backgroundColor = cellProp.italics
      ? ACTIVE_COLOR_PROPERTY
      : INACTIVE_COLOR_PROPERTY;
    underline.style.backgroundColor = cellProp.underline
      ? ACTIVE_COLOR_PROPERTY
      : INACTIVE_COLOR_PROPERTY;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    color.value = cellProp.color;
    bgColor.value = cellProp.bgColor;
    switch (cellProp.alignment) {
      case 'left':
        leftAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        break;
      case 'center':
        leftAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        break;
      case 'right':
        leftAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        centerAlign.style.backgroundColor = INACTIVE_COLOR_PROPERTY;
        rightAlign.style.backgroundColor = ACTIVE_COLOR_PROPERTY;
        break;
      default:
        break;
    }

    let formulaBar = document.querySelector('.formula-bar');
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;
  });
}
