import useDataService, {tabulate} from './dataService'

describe('useDataService', () => {
  test('no data', () => {
    const {tableData, onDelete} = useDataService()
    expect(tableData).toBeDefined()
    expect(onDelete).toBeDefined()
  })

  test('not array', () => {
    expect(() => useDataService(1)).toThrow()
    expect(() => useDataService('a')).toThrow()
    expect(() => useDataService({a: 1})).toThrow()
  })

  test('array of not objects', () => {
    const {tableData, onDelete} = useDataService(['a'])
    expect(tableData).toBeDefined()
    expect(onDelete).toBeDefined()
  })
})

describe('tabulate', () => {
  test('empty array', () => {
    const {header, columns, rows} = tabulate([], 'header')
    expect(header).toEqual('header')
    expect(columns).toEqual([])
    expect(rows).toEqual([])
  })

  test('flat array of objects', () => {
    const {header, columns, rows} = tabulate([{a: 1, b: 2}, {a: 3, b: 4}])
    expect(header).toEqual('')
    expect(columns).toEqual(['a', 'b'])
    expect(rows[0].cells).toEqual([1, 2])
    expect(rows[1].cells).toEqual([3, 4])
  })
})
