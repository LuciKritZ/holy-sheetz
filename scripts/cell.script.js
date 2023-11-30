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

/**
 * File used for Storage
 */

let sheetDB = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < columns; j++) {
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
bold.addEventListener('click', (e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal';
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp;
  cell.focus();
});

// Italics property
italics.addEventListener('click', (e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.italics = !cellProp.italics;
  cell.style.fontStyle = cellProp.italics ? 'italic' : 'normal';
  italics.style.backgroundColor = cellProp.italics
    ? activeColorProp
    : inactiveColorProp;
  cell.focus();
});

// Underline property
underline.addEventListener('click', (e) => {
  let address = addressBarInput.value;
  let [cell, cellProp] = getCellAndCellProps(address);

  // Modification
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? 'underline' : 'none';
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp;
  cell.focus();
});

// Font size property
fontSize.addEventListener('change', (e) => {
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
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case 'center':
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case 'right':
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
      default:
        break;
    }
    cell.focus();
  });
});

let allCells = document.querySelectorAll('.cell');

for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

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
      ? activeColorProp
      : inactiveColorProp;
    italics.style.backgroundColor = cellProp.italics
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    color.value = cellProp.color;
    bgColor.value = cellProp.bgColor;
    switch (cellProp.alignment) {
      case 'left':
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case 'center':
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case 'right':
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
      default:
        break;
    }

    let formulaBar = document.querySelector('.formula-bar');
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;
  });
}
