import React from 'react'
import ReactDOM from 'react-dom'
import Table from '.'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Table
      columns={['a', 'b']}
      rows={[
        {
          rowIndex: 0,
          cells: [1, '2'],
          children: [
            {
              header: 'child',
              columns: ['c'],
              rows: [],
            },
          ],
          deleting: false,
          deleted: false,
        },
      ]}
      onDelete={() => undefined}
    />,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
