import React from 'react'
import T from 'prop-types'
import './index.css'

const Table = ({
  header,
  columns,
  rows,
  children,
  visibleChildren,
  onShowMore,
  onShowLess,
  onDelete,
}) => {
  // console.debug(header, columns)
  return (
    <div className="Table">
      <div className="Table-header" />
    </div>
  )
}

export default Table

Table.propTypes = {
  header: T.string,
  columns: T.arrayOf(T.string).isRequired,
  rows: T.arrayOf(
    T.shape({
      cells: T.arrayOf(T.oneOfType([T.string, T.number])).isRequired,
      children: T.arrayOf(() => Table.propTypes.tableData),
    })
  ).isRequired,
  visibleChildren: T.number,
  onShowMore: T.func,
  onShowLess: T.func,
  onDelete: T.func,
}
