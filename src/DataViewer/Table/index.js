import React, {useState} from 'react'
import T from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCaretRight} from '@fortawesome/free-solid-svg-icons'
import './index.css'

const MAX_COLSPAN = 42 // more than reasonable amount of max columns
function Table({header, columns, rows, onDelete}) {
  return (
    <table className="Table">
      <thead>
        {header ? (
          <tr>
            <td className="Table-aboveHeader" colSpan={MAX_COLSPAN}>
              {header}
            </td>
          </tr>
        ) : null}
        <tr className="Table-columns">
          <th /* first column label empty, for > buttons */ />
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <Row key={rowIndex} {...{row, rowIndex}} />
        ))}
      </tbody>
    </table>
  )
}

function Row({row, rowIndex}) {
  const [visibleChildren, setVisibleChildren] = useState(0)
  const handleMore = () =>
    setVisibleChildren(visibleChildren ? 2 * visibleChildren : 10)
  const handleLess = () => setVisibleChildren(0)
  const handleToggle = () => (visibleChildren ? handleLess() : handleMore())
  const hasChildren = row.children.length
  const hasChildrenClass = hasChildren ? 'hasChildren' : 'noChildren'
  const rowIndexClass = (rowIndex + 1) % 2 ? 'odd' : 'even'
  const expandedClass = visibleChildren ? 'expanded' : 'collapsed'

  return (
    <>
      <tr
        className={`Table-row ${hasChildrenClass} ${rowIndexClass}`}
        onClick={handleToggle}
      >
        <td className={`Table-toggle ${expandedClass}`}>
          {hasChildren ? <FontAwesomeIcon icon={faCaretRight} /> : null}
        </td>
        {// Array.from converts a sparse array into a dense one
        Array.from(row.cells).map((cell, cellIndex) => (
          <td className="Table-cell" key={cellIndex}>
            {cell}
          </td>
        ))}
      </tr>
      {row.children.map((child, childIndex) => (
        <tr key={childIndex}>
          <td className={`Table-child ${expandedClass}`} colSpan={MAX_COLSPAN}>
            <div>
              <Table {...child} />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default Table

Table.propTypes = {
  header: T.string,
  columns: T.arrayOf(T.node).isRequired,
  rows: T.arrayOf(
    T.shape({
      cells: T.arrayOf(T.node).isRequired,
      children: T.arrayOf(() => Table.propTypes.tableData),
    })
  ).isRequired,
  onDelete: T.func,
}
