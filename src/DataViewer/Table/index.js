import React from 'react'
import PropTypes from 'prop-types'
import './index.css'

const Table = ({tableData, onDelete}) => (
  <div className="Table">{JSON.stringify(tableData, null, 2)}</div>
)

export default Table

const tableDataType = PropTypes.shape({
  header: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
})
Table.propTypes = {
  tableData: tableDataType.isRequired,
  onDelete: PropTypes.func,
}
