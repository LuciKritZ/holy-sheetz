/**
 * Variables:
 * 1. visited[]: The nodes which are already visited.
 * 2. dfsVisited[]: The child nodes array used as a stack trace.
 *
 * Algorithm:
 * 1. If one node is cyclic, graph is cyclic. Throw an error and stop the traversal.
 * 2. On node visit start:
 * visited[node] = true;
 * dfsVisited[node] = true;
 * 3. On node end:
 * dfsVisited[node] = false;
 * 4. visited[node] == true && dfsVisited[node] = true -> cycle detected;
 *
 * Implementation:
 */

let graphComponentMatrix = [];
for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
  let row = [];
  for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
    // Basic array storage
    // More than 1 child relation (dependency)
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

/**
 * addOrRemoveChildInGraphMatrix
 * Adds/Removes child parent relationship in graphComponentMatrix
 * @param {string} addOrRemoveChildInGraphMatrix.formula
 * @param {string} addOrRemoveChildInGraphMatrix.childAddress
 * @param {string} addOrRemoveChildInGraphMatrix.operation
 * @returns {null}
 */
function addOrRemoveChildInGraphMatrix({
  formula,
  childAddress,
  operation = 'add',
}) {
  const [childRowId, childColumnId] = decodeCellLocation(childAddress);
  let encodedFormula = formula.split(' ');

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    if (asciiValue >= 65 && asciiValue <= 90) {
      const [parentRowId, parentColumnId] = decodeCellLocation(
        encodedFormula[i]
      );

      switch (operation) {
        case 'add':
          // B1: A1 + 1
          // rowId -> i, columnId -> j
          graphComponentMatrix[parentRowId][parentColumnId].push([
            childRowId,
            childColumnId,
          ]);
          break;
        case 'remove':
          graphComponentMatrix[parentRowId][parentColumnId].pop();
          break;
        default:
          break;
      }
    }
  }
}

/**
 * isGraphCyclic
 * Returns a boolean, true -> cycle detected, false -> cycle not detected
 * @param {array} graphComponentMatrixSnapshot
 * @returns {boolean}
 */
function isGraphCyclic(graphComponentMatrixSnapshot) {
  // Dependency [2D array] -> visited, dfsVisited

  // Trace for nodes traversed
  let visited = [];

  // Stack trace for node's children
  let dfsVisited = [];

  // Initialize 2D array for cycle detection
  for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
      // Pushing the default values to false
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < DEFAULT_ROWS_COUNT; i++) {
    for (let j = 0; j < DEFAULT_COLUMNS_COUNT; j++) {
      if (!visited[i][j]) {
        let response = checkDFSCycleDetection({
          graphComponentMatrixSnapshot,
          sourceRow: i,
          sourceColumn: j,
          visited,
          dfsVisited,
        });

        if (!!response) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * checkDFSCycleDetection
 * Algo:
 * 1. Initial step: set visited(true) and dfsVisited(true)
 * 2. Ending step: set dfsVisited(false)
 * 3. Cycle detection condition:
 *    if (
 *      visited[sourceRow][sourceColumn] == true &&
 *      dfsVisited[sourceRow][sourceColumn] == true
 *    ) -> cycle detected
 * @param {array} checkDFSCycleDetection.graphComponentMatrixSnapshot
 * @param {integer} checkDFSCycleDetection.sourceRow
 * @param {integer} checkDFSCycleDetection.sourceColumn
 * @param {array} checkDFSCycleDetection.visited
 * @param {array} checkDFSCycleDetection.dfsVisited
 * @returns {boolean}
 */
function checkDFSCycleDetection({
  graphComponentMatrixSnapshot,
  sourceRow,
  sourceColumn,
  visited,
  dfsVisited,
}) {
  // Initial step
  visited[sourceRow][sourceColumn] = true;
  dfsVisited[sourceRow][sourceColumn] = true;

  // Cycle detection condition
  for (
    let children = 0;
    children < graphComponentMatrixSnapshot[sourceRow][sourceColumn].length;
    children++
  ) {
    let [neighborRowId, neighborColumnId] =
      graphComponentMatrixSnapshot[sourceRow][sourceColumn][children];
    if (!Boolean(visited[neighborRowId][neighborColumnId])) {
      let response = checkDFSCycleDetection({
        graphComponentMatrixSnapshot,
        sourceRow: neighborRowId,
        sourceColumn: neighborColumnId,
        visited,
        dfsVisited,
      });

      // The moment when any cycle is found, we don't need to traverse more, we will return true.
      if (!!response) {
        return true;
      }
    }

    // Base condition for cycle detection
    else if (!!dfsVisited[neighborRowId][neighborColumnId]) {
      return true;
    }
  }

  // Ending step
  dfsVisited[sourceRow][sourceColumn] = false;

  // No cycles detected
  return false;
}
