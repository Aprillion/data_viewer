export const tabulate = (array = [], header = '') => {
  const columns = {}
  const rows = []
  let columnIndex = 0
  array.forEach((obj) => {
    // cells might be a sparse Array if column keys are inconsistent
    const row = {cells: [], children: [], deleting: false}
    if (typeof obj !== 'object' || !obj) {
      obj = {[header]: obj}
    }
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        row.children.push(tabulate(value, key))
        return
      }
      if (columns[key] === undefined) {
        // use column order from 1st item and add new columns from other items to the end
        columns[key] = columnIndex
        columnIndex++
      }
      const cellIndex = columns[key]
      row.cells[cellIndex] = value
    })
    rows.push(row)
  })
  return {header, columns: Object.keys(columns), rows}
}

const onDelete = (path) => console.log('onDelete', path)
export const useTable = (data = [], standardize = (data) => data) => {
  const standardized = standardize(data)
  let tabulated
  if (Array.isArray(standardized)) {
    tabulated = tabulate(standardized)
  } else if (!standardized) {
    throw new TypeError(
      'standardize function must return some data (use an empty array for no data)'
    )
  } else {
    tabulated = tabulate([standardized])
  }

  return {
    ...tabulated,
    onDelete,
  }
}
