/**
 * @function getGraphCyclicTracePath
 * Returns a Promise of boolean which detects the graph cyclic trace path.
 * @param {array} graphComponentMatrixSnapshot
 * @param {array} sourceCell
 * @returns {Promise<boolean>}
 */
async function getGraphCyclicTracePath(
  graphComponentMatrixSnapshot,
  sourceCell
) {
  let [sourceRow, sourceColumn] = sourceCell;

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

  let response = await showDFSCycleDetectionTracePath({
    graphComponentMatrixSnapshot,
    sourceRow,
    sourceColumn,
    visited,
    dfsVisited,
  });

  if (response) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

/**
 * @function synchronousDelay
 * setTimeout is an asynchronous API.
 * Which means that it will go to callback queue.
 * Hence, we will make it synchronous by using Promises.
 * @returns {Promise<boolean>}
 */
function synchronousDelay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

/**
 * @function showDFSCycleDetectionTracePath
 * Extension of checkDFSCycleDetection
 * @see file://./cycle-detection.formula.js#checkDFSCycleDetection
 * @param {array} checkDFSCycleDetection.graphComponentMatrixSnapshot
 * @param {integer} checkDFSCycleDetection.sourceRow
 * @param {integer} checkDFSCycleDetection.sourceColumn
 * @param {array} checkDFSCycleDetection.visited
 * @param {array} checkDFSCycleDetection.dfsVisited
 * @returns {Promise<boolean>}
 */
async function showDFSCycleDetectionTracePath({
  graphComponentMatrixSnapshot,
  sourceRow,
  sourceColumn,
  visited,
  dfsVisited,
}) {
  // Initial step
  visited[sourceRow][sourceColumn] = true;
  dfsVisited[sourceRow][sourceColumn] = true;

  const sourceCell = document.querySelector(
    `.cell[rowId="${sourceRow}"][columnId="${sourceColumn}"]`
  );

  sourceCell.style.backgroundColor = 'lightblue';

  // A delay of x milliseconds to display the color tracking
  await synchronousDelay();

  // Cycle detection condition
  for (
    let children = 0;
    children < graphComponentMatrixSnapshot[sourceRow][sourceColumn].length;
    children++
  ) {
    let [neighborRowId, neighborColumnId] =
      graphComponentMatrixSnapshot[sourceRow][sourceColumn][children];
    if (!Boolean(visited[neighborRowId][neighborColumnId])) {
      let response = await showDFSCycleDetectionTracePath({
        graphComponentMatrixSnapshot,
        sourceRow: neighborRowId,
        sourceColumn: neighborColumnId,
        visited,
        dfsVisited,
      });

      // The moment when any cycle is found, we don't need to traverse more, we will return true.
      if (!!response) {
        sourceCell.style.backgroundColor = 'transparent';
        await synchronousDelay();
        return Promise.resolve(true);
      }
    }

    // Base condition for cycle detection
    else if (!!dfsVisited[neighborRowId][neighborColumnId]) {
      const cyclicCell = document.querySelector(
        `.cell[rowId="${neighborRowId}"][columnId="${neighborColumnId}"]`
      );

      cyclicCell.style.backgroundColor = 'lightsalmon';
      await synchronousDelay();

      cyclicCell.style.backgroundColor = 'transparent';
      await synchronousDelay();

      sourceCell.style.backgroundColor = 'transparent';
      await synchronousDelay();

      return Promise.resolve(true);
    }
  }

  // Ending step
  dfsVisited[sourceRow][sourceColumn] = false;

  // No cycles detected
  return Promise.resolve(false);
}
