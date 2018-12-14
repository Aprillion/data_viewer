import {useState, useEffect} from 'react'

const noop = () => undefined

// TODO: convert `onDelete` from OOP interface modifying object in place to an immutable reduce function
//       and remove `forceRender`
export const tabulate = (array = [], header = '', forceRender = noop) => {
  const columns = {}
  const rows = []
  let columnIndex = 0
  array.forEach((obj) => {
    // cells might be a sparse Array if column keys are inconsistent
    const row = {
      cells: [],
      children: [],
      deleting: false,
      deleted: false,
      onDelete: () => {
        row.deleting = true
        forceRender()
        setTimeout(() => {
          row.deleted = true
          forceRender()
        }, 1000)
      },
    }
    if (typeof obj !== 'object' || !obj) {
      obj = {[header]: obj}
    }
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        row.children.push(tabulate(value, key, forceRender))
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

export const useTable = (data = [], standardize = (data) => data) => {
  const [tabulated, setTabulated] = useState({
    header: '',
    columns: [],
    rows: [],
  })
  const [dataVersion, setDataVersion] = useState(0)
  const forceRender = () => setDataVersion(dataVersion + 1)

  useEffect(() => {
    const standardized = standardize(data)
    if (Array.isArray(standardized)) {
      setTabulated(tabulate(standardized, '', forceRender))
    } else if (!standardized) {
      throw new TypeError(
        'standardize function must return some data (use an empty array for no data)'
      )
    } else {
      setTabulated(tabulate([standardized], '', forceRender))
    }
  }, [])

  return {
    ...tabulated,
  }
}
