import useDataService from './dataService'

test('no data', () => {
  const {tableData, onDelete} = useDataService()
  expect(tableData).toBeDefined()
  expect(onDelete).toBeDefined()
})

test('object', () => {
  const {tableData, onDelete} = useDataService({a: 1})
  expect(tableData).toBeDefined()
  expect(onDelete).toBeDefined()
})

test('array', () => {
  const {tableData, onDelete} = useDataService(['a'])
  expect(tableData).toBeDefined()
  expect(onDelete).toBeDefined()
})
