// remove hidden properties from data-1.json, that should not be visible in the table
// (throws for unexpected data shape)

const itemMapper = (item) => {
  let kidKeys = item.kids ? Object.keys(item.kids) : []
  kidKeys.forEach((key) => {
    item.kids[key] = item.kids[key].records.map(itemMapper)
  })
  return {...item.data, ...item.kids}
}

export const standardize = (rawData = []) => rawData.map(itemMapper)
