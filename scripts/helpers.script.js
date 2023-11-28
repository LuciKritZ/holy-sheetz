let activeColorProp = '#d1d8e0';
let inactiveColorProp = '#ecf0f1';

function encodeCellLocation(columnId, rowId) {
  return `${String.fromCharCode(65 + columnId)}${rowId + 1}`;
}

function decodeCellLocation(encodedCell) {
  return [
    Number(encodedCell.charCodeAt(0)) - 65,
    Number(encodedCell.slice(1) - 1),
  ];
}

function findActiveCell(address) {
  const [colId, rowId] = decodeCellLocation(address);
  let cell = document.querySelector(
    `.cell[rowId="${rowId}"][columnId="${colId}"]`
  );
  let cellProp = sheetDB[rowId][colId];
  return [cell, cellProp];
}
