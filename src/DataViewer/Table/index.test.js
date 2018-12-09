import React from 'react'
import ReactDOM from 'react-dom'
import Table from '.'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Table
      tableData={{
        columns: ['a', 'b'],
        rows: [
          {
            cells: [1, '2'],
            children: [
              {
                header: 'child',
                columns: ['c'],
                rows: [],
              },
            ],
          },
        ],
      }}
    />,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
