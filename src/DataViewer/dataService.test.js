import {renderHook} from 'react-hooks-testing-library'
import {useTable as rawUseTable, tabulate} from './dataService'

function useTable() {
  return renderHook(() => rawUseTable.apply(null, arguments)).result.current
}

describe('useDataService', () => {
  test('undefined', () => {
    const {header, columns, rows} = useTable()
    expect(header).toEqual('')
    expect(columns).toEqual([])
    expect(rows).toEqual([])
  })

  // TODO: figure out how to test custom hooks non-initial state...
  test('string', () => {
    expect(useTable('a').rows[0].cells).toEqual(useTable(['a']).rows[0].cells)
  })

  test('number', () => {
    expect(useTable(1).rows[0].cells).toEqual(useTable([1]).rows[0].cells)
  })

  test('array', () => {
    const {header, columns, rows} = useTable(['a', 1])
    expect(header).toEqual('')
    expect(columns).toEqual([''])
    expect(rows.map((r) => r.cells[0])).toEqual(['a', 1])
  })

  test('object', () => {
    const {header, columns, rows} = useTable({a: [1, 2, 3]})
    expect(header).toEqual('')
    expect(columns).toEqual([])
    expect(rows[0]).toMatchObject({
      cells: [],
      children: [
        {
          header: 'a',
          columns: ['a'],
          rows: [1, 2, 3].map((n) => ({cells: [n], children: []})),
        },
      ],
    })
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

  test('nested array of objects', () => {
    const {columns, rows} = tabulate([{a: 1, b: [{c: [{d: 4, e: 5}]}]}])
    expect(columns).toEqual(['a'])
    expect(rows[0].cells).toEqual([1])
    expect(rows[0].children[0].header).toEqual('b')
    expect(rows[0].children[0].columns).toEqual([])
    expect(rows[0].children[0].rows[0].cells).toEqual([])

    const innerChild = rows[0].children[0].rows[0].children[0]
    expect(innerChild.header).toEqual('c')
    expect(innerChild.columns).toEqual(['d', 'e'])
    expect(innerChild.rows[0].cells).toEqual([4, 5])
  })

  test('array of mixed types', () => {
    const input = ['a', 'bb', 1, null, {c: 2}]
    const {columns, rows} = tabulate(input, 'mixed')
    expect(columns).toEqual(['mixed', 'c'])

    const expectedMixed = ['a', 'bb', 1, null, undefined]
    const expectedC = [undefined, undefined, undefined, undefined, 2]
    expect(rows.map((row) => row.cells[0])).toEqual(expectedMixed)
    expect(rows.map((row) => row.cells[1])).toEqual(expectedC)
  })

  test('sparse columns', () => {
    const {columns, rows} = tabulate([{a: 1, b: 2}, {a: 3, c: 4}])
    expect(columns).toEqual(['a', 'b', 'c'])
    expect(rows[0].cells).toEqual([1, 2])
    expect(rows[1].cells).toEqual([3, undefined, 4])
  })
})
