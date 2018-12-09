import rawData from './data-1.json'
import {standardize} from './data-1.config'

it('hidden props are removed', () => {
  const data = standardize(rawData)
  expect(data[0].data).toBeUndefined()
  expect(Array.isArray(data[0].has_relatives)).toBeTruthy()
})
