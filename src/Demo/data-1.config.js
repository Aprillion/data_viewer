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

// TODO: implement as per backend APIs
const deletePersonApi = (id, len) =>
  Promise.resolve(console.log(`Delete patient ${id} (with ${len} relatives)`))
const deleteRelationApi = (relativeId, patientId, len) =>
  Promise.resolve(
    console.log(
      `Delete relative ${relativeId} of patient ${patientId} (with ${len} phones)`
    )
  )
const deletePhoneApi = (phoneId, relativeId) =>
  Promise.resolve(
    console.log(`Delete phone ${phoneId} of relative ${relativeId}`)
  )

export const deleteOnServer = (columns, cells, childrenLengths) => {
  if (columns.includes('Identification number')) {
    return deletePersonApi(cells[0], childrenLengths[0])
  } else if (columns.includes('Relative ID')) {
    return deleteRelationApi(cells[0], cells[1], childrenLengths[0])
  } else if (columns.includes('Phone ID')) {
    return deletePhoneApi(cells[0], cells[1])
  }
}
