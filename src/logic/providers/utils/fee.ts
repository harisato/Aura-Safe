const calculateGasFee = (gas: number, gasPrice: number, decimal: number): number => {
  return (+gas * +gasPrice) / Math.pow(10, decimal)
}

export default calculateGasFee
