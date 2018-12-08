import React from 'react'
import Table from './Table'
import useDataService from './dataService'

const DataViewer = ({data}) => {
  const {tableData, onDelete} = useDataService(data)

  return (
    <div className="DataViewer">
      <Table {...{tableData, onDelete}} />
    </div>
  )
}

export default DataViewer
