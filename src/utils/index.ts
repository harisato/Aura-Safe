export const validateFloatNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}
export const formatNumber = (value: any): string => {
  return value == '' ? '' : (+value).toString()
}
export const isNumberKeyPress = (event): boolean => {
  if (event.key == '.') {
    return true
  }
  if (!isFinite(event.key) || event.key === ' ') {
    event.preventDefault()
    return false
  }
  return true
}
