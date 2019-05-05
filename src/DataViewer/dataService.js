import {useState, useEffect} from 'react'

const identityFn = (x) => x
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const tabulate = (array = [], header = '') => {
  const columns = {}
  const rows = []
  let columnIndex = 0
  array.forEach((obj, objIndex) => {
    // cells might be a sparse Array if column keys are inconsistent
    const row = {
      rowIndex: objIndex,
      cells: [],
      children: [],
      deleting: false,
      deleted: false,
    }
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

export const useTable = (
  data = [],
  standardize = identityFn,
  deleteOnServer
) => {
  const [header, setHeader] = useState('')
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    let standardized = standardize(data)
    if (!standardized) {
      throw new TypeError(
        'standardize function must return some data (use an empty array for no data)'
      )
    } else if (!Array.isArray(standardized)) {
      standardized = [standardized]
    }
    const {header: h, columns: c, rows: r} = tabulate(standardized, '')
    setHeader(h)
    setColumns(c)
    setRows(r)
  }, [data, standardize])

  const onDelete = (columns, row) => {
    // using mutable objects to work around recursive data structure complexity
    row.deleting = true
    let serverPromise = Promise.resolve()
    if (deleteOnServer) {
      const returned = deleteOnServer(
        [...columns],
        [...row.cells],
        row.children.map((c) => c.rows.length)
      )
      if (returned && returned.then) {
        serverPromise = returned
      }
    }
    Promise.all([serverPromise, delay(500)])
      .then(() => {
        // forward compatibile with undo feature
        row.deleted = true
        setRows([...rows])
      })
      .catch((er) => {
        // TODO: ask designer for modal or other error indicator
        alert(`Removal failed\n${er}`)
        console.error(er)
      })
  }

  return {header, columns, rows, onDelete}
}
