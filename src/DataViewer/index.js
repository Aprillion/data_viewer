import React from 'react'
import Table from './Table'
import {useTable} from './dataService'

const DataViewer = ({data, standardize, deleteOnServer}) => {
  const tableProps = useTable(data, standardize, deleteOnServer)

  return (
    <div className="DataViewer">
      <Table {...tableProps} />
    </div>
  )
}

export default DataViewer
