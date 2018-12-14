import React, {useState} from 'react'
import T from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCaretRight, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
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
        {rows
          .filter((row) => !row.deleted)
          .map((row, rowIndex) => (
            <Row key={row.cells} {...{columns, row, rowIndex, onDelete}} />
          ))}
      </tbody>
    </table>
  )
}

function Row({columns, row, rowIndex, onDelete}) {
  const {cells, children, deleting} = row

  // TODO: extract logic to custom hook (useRowState), convert Row to dumb component and combine in DataViewer
  const [visibleChildren, setVisibleChildren] = useState(0)
  const [deleteHover, setDeleteHover] = useState(false)

  const handleMore = () =>
    setVisibleChildren(visibleChildren ? 2 * visibleChildren : 10)
  const handleLess = () => setVisibleChildren(0)
  const handleToggle = () => (visibleChildren ? handleLess() : handleMore())
  const handleEnableDeleteHover = () => setDeleteHover(true)
  const handleDisableDeleteHover = () => setDeleteHover(false)
  const handleDelete = (e) => {
    // prevent handleToggle
    e.stopPropagation()
    // TODO: confirmation dialog and/or undo
    // TODO: use an explicit identifier instead of object identity
    onDelete(columns, row)
  }

  const lastCellIndex = cells.length - 1
  const hasChildren = children.filter(({rows: childRows}) =>
    childRows.some((r) => !r.deleted)
  ).length
  const hasChildrenClass = hasChildren ? 'hasChildren' : 'noChildren'
  const rowIndexClass = (rowIndex + 1) % 2 ? 'odd' : 'even'
  // prettier-ignore
  const deleteClass = deleting ? 'deleteStarted' : (deleteHover ? 'deleteHover' : '')
  const expandedClass =
    hasChildren && visibleChildren && !deleting ? 'expanded' : 'collapsed'

  return (
    <>
      <tr
        className={`Table-row ${hasChildrenClass} ${rowIndexClass} ${deleteClass}`}
        onClick={handleToggle}
        title={deleting ? 'Removing...' : undefined}
      >
        <td className={`Table-toggle ${expandedClass}`}>
          {hasChildren ? (
            <FontAwesomeIcon
              icon={faCaretRight}
              className="Table-expand-icon"
            />
          ) : null}
        </td>
        {// Array.from converts a sparse array into a dense one
        Array.from(cells).map((cell, cellIndex) => (
          <td className="Table-cell" key={cellIndex}>
            {cell}
            {cellIndex === lastCellIndex && !deleting && (
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="Table-trash-icon"
                onClick={handleDelete}
                onMouseEnter={handleEnableDeleteHover}
                onMouseLeave={handleDisableDeleteHover}
                title="Remove item"
              />
            )}
          </td>
        ))}
      </tr>
      {children.map((child, childIndex) => (
        <tr key={childIndex}>
          <td className={`Table-child ${expandedClass}`} colSpan={MAX_COLSPAN}>
            <div>
              {visibleChildren ? <Table {...{...child, onDelete}} /> : null}
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default Table

const RowType = {
  cells: T.arrayOf(T.node).isRequired,
  children: T.arrayOf(() => RowType),
  deleting: T.bool.isRequired,
  deleted: T.bool.isRequired,
}

Table.propTypes = {
  header: T.string,
  columns: T.arrayOf(T.node).isRequired,
  rows: T.arrayOf(T.shape(RowType)).isRequired,
  onDelete: T.func.isRequired,
}
Table.defaultProps = {
  header: undefined,
}

Row.propTypes = {
  columns: T.arrayOf(T.node).isRequired,
  row: T.shape(RowType),
  rowIndex: T.number.isRequired,
  onDelete: T.func.isRequired,
}
