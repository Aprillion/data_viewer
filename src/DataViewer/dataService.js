const useDataService = (data = {}, removeHiddenProps = (data) => data) => ({
  tableData: removeHiddenProps(data),
  onDelete: (path) => console.log('onDelete', path),
})

export default useDataService
