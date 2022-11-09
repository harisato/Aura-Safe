export const getDisplayAddress = (address) => {
  const result = `${address?.substring(0, 5)}...${address?.substring(
    address ? address?.length - 5 : 0,
    address ? address?.length : 1,
  )}`
  return result
}
